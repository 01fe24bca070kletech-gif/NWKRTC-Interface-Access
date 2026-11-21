import { useState, useEffect, useRef } from "react";
import { ref, set, update, push, remove, onValue } from "firebase/database";
import { LogOut, Navigation, Square, AlertTriangle, Clock, Phone, Bus, MapPin } from "lucide-react";
import { db } from "../firebase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useList, todayString, nowTime, to12h } from "../data/dbHelpers.js";
import LoginForm from "../components/LoginForm.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const ISSUE_TYPES = ["Breakdown", "Traffic Delay", "Accident", "Emergency"];

// ---------- One trip card ----------
function TripCard({ trip, sharing, gpsStatus, onStart, onDelay, onComplete, onResume, onIssue }) {
  const [remarks, setRemarks] = useState("");
  const [showIssue, setShowIssue] = useState(false);
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [issueText, setIssueText] = useState("");
  const [localMsg, setLocalMsg] = useState("");

  const running = trip.status === "In Progress" || trip.status === "Delayed";

  async function sendIssue() {
    if (!issueText.trim()) return setLocalMsg("Please describe the problem.");
    await onIssue(trip, issueType, issueText.trim());
    setIssueText("");
    setShowIssue(false);
    setLocalMsg("Report sent to Admin ✔");
  }

  return (
    <article className="bus-card">
      <div className="bus-card-top">
        <span className="bus-number">
          <Bus size={22} /> {trip.busNumber}
        </span>
        <StatusBadge status={trip.status} />
      </div>

      <p className="trip-route">
        <MapPin size={18} /> {trip.source} to {trip.destination}
      </p>
      <p className="small-note">Bus registration: {trip.busReg}</p>
      <p className="small-note">Stops: {trip.stops || "No stops in between"}</p>

      <div className="time-grid">
        <div className="time-box">
          <span className="time-label">Scheduled departure</span>
          <span className="time-value">{to12h(trip.departureTime)}</span>
        </div>
        <div className="time-box">
          <span className="time-label">Scheduled arrival</span>
          <span className="time-value">{to12h(trip.arrivalTime)}</span>
        </div>
        <div className="time-box time-box-orange">
          <span className="time-label">Actual dep. / arr.</span>
          <span className="time-value small">
            {trip.actualDeparture || "-"} / {trip.actualArrival || "-"}
          </span>
        </div>
      </div>

      {trip.status === "Scheduled" && (
        <button className="btn btn-orange btn-large full" onClick={() => onStart(trip)}>
          <Navigation size={22} /> Start Trip
        </button>
      )}

      {running && (
        <>
          <p className="notice">{sharing ? gpsStatus : "GPS sharing is off."}</p>
          {!sharing && (
            <button className="btn btn-light btn-small" onClick={() => onResume(trip)}>
              <Navigation size={18} /> Resume GPS sharing
            </button>
          )}

          <div className="field remarks-field">
            <label htmlFor={`remarks-${trip.id}`}>TRIP REMARKS (optional)</label>
            <input
              id={`remarks-${trip.id}`}
              type="text"
              placeholder="Example: Reached on time"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="form-actions">
            {trip.status === "In Progress" && (
              <button className="btn btn-light btn-small" onClick={() => onDelay(trip)}>
                <Clock size={18} /> Mark Delayed
              </button>
            )}
            <button className="btn btn-light btn-small" onClick={() => setShowIssue(!showIssue)}>
              <AlertTriangle size={18} /> Report Issue
            </button>
            <button className="btn btn-green btn-small" onClick={() => onComplete(trip, remarks.trim())}>
              <Square size={18} /> Complete Trip
            </button>
          </div>

          {showIssue && (
            <div className="issue-box">
              <div className="field">
                <label htmlFor={`issue-${trip.id}`}>ISSUE TYPE</label>
                <select id={`issue-${trip.id}`} value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                  {ISSUE_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor={`issueText-${trip.id}`}>WHAT HAPPENED?</label>
                <input
                  id={`issueText-${trip.id}`}
                  type="text"
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                />
              </div>
              <button className="btn btn-orange btn-small" onClick={sendIssue}>
                Send to Admin
              </button>
            </div>
          )}
        </>
      )}

      {trip.status === "Completed" && trip.remarks && <p className="small-note">Remarks: {trip.remarks}</p>}
      {localMsg && <p className="small-note">{localMsg}</p>}
    </article>
  );
}

// ---------- Driver dashboard ----------
function DriverDashboard() {
  const { user, profile, logout } = useAuth();
  const [driver, setDriver] = useState(null);
  const { items: trips, error } = useList("trips", user.uid); // only THIS driver's trips
  const [message, setMessage] = useState("");
  const [sharingId, setSharingId] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("");

  const watchId = useRef(null);
  const speeds = useRef([]);
  const wakeLock = useRef(null);

  // Driver profile (name, phone, assigned bus)
  useEffect(() => {
    const stop = onValue(ref(db, `drivers/${profile.driverId}`), (s) => setDriver(s.val()));
    return () => stop();
  }, [profile.driverId]);

  // Stop GPS if the driver leaves this page
  useEffect(() => {
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const today = todayString();
  const todays = trips.filter((t) => t.date === today).sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  const history = trips
    .filter((t) => t.status === "Completed" || t.status === "Cancelled" || t.date < today)
    .sort((a, b) => (b.date + b.departureTime).localeCompare(a.date + a.departureTime));

  // ----- GPS sharing (feeds the passenger Live Map) -----
  function startGps(trip) {
    if (!navigator.geolocation) return setGpsStatus("This phone does not support GPS.");
    if (trip.destLat == null || trip.destLng == null) return setGpsStatus("This route has no destination position.");
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);

    navigator.wakeLock?.request("screen").then((l) => (wakeLock.current = l)).catch(() => {});
    speeds.current = [];
    setSharingId(trip.id);
    setGpsStatus("Waiting for GPS… please allow location.");

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed } = pos.coords;
        speeds.current = [...speeds.current, (speed || 0) * 3.6].slice(-5);
        const avg = speeds.current.reduce((a, b) => a + b, 0) / speeds.current.length;
        set(ref(db, `live/${trip.busNumber}`), {
          lat: latitude,
          lng: longitude,
          speedKmh: Math.round(avg),
          updatedAt: Date.now(),
          driver: trip.driverName,
          destination: { name: trip.destination, lat: trip.destLat, lng: trip.destLng },
        });
        setGpsStatus("Sharing live location ✔");
      },
      (err) => setGpsStatus("GPS error: " + err.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  }

  function stopGps(trip) {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
    wakeLock.current?.release?.();
    remove(ref(db, `live/${trip.busNumber}`));
    setSharingId(null);
  }

  // ----- Trip actions (every change is saved in the database, so Admin sees it) -----
  async function run(action) {
    setMessage("");
    try {
      await action();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function sendNotification(trip, type, text) {
    return push(ref(db, "notifications"), {
      type,
      message: text,
      driverName: trip.driverName,
      driverUid: user.uid,
      busNumber: trip.busNumber,
      routeLabel: trip.routeLabel,
      tripId: trip.id,
      time: Date.now(),
      read: false,
    });
  }

  const startTrip = (trip) =>
    run(async () => {
      if (todays.some((t) => t.status === "In Progress" || t.status === "Delayed"))
        throw new Error("Please complete your running trip first.");
      await update(ref(db, `trips/${trip.id}`), { status: "In Progress", actualDeparture: nowTime(), startedAt: Date.now() });
      startGps(trip);
    });

  const markDelayed = (trip) =>
    run(async () => {
      await update(ref(db, `trips/${trip.id}`), { status: "Delayed", wasDelayed: true });
      await sendNotification(trip, "Delay", "The driver marked this trip as delayed.");
    });

  const completeTrip = (trip, remarks) =>
    run(async () => {
      stopGps(trip);
      await update(ref(db, `trips/${trip.id}`), {
        status: "Completed",
        actualArrival: nowTime(),
        completedAt: Date.now(),
        remarks: remarks || "",
      });
    });

  const reportIssue = (trip, type, text) => run(() => sendNotification(trip, type, text));

  return (
    <section className="section">
      <div className="container narrow">
        <div className="driver-head">
          <div>
            <h1 className="page-title">Welcome, {driver?.name || profile.name}</h1>
            <p className="page-subtitle">Driver ID: {profile.driverId}</p>
          </div>
          <button
            className="btn btn-green btn-small"
            onClick={() => {
              if (sharingId) stopGps(trips.find((t) => t.id === sharingId) || { busNumber: "" });
              logout();
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="card">
          <h2 className="section-title">My profile</h2>
          <ul className="live-list">
            <li><Phone size={18} /> Phone: <strong>{driver?.phone || "-"}</strong></li>
            <li><Bus size={18} /> Assigned bus: <strong>{driver?.assignedBus || "Not assigned"}</strong></li>
          </ul>
        </div>

        <h2 className="section-title">Today's trips ({today})</h2>
        {error && <p className="notice">{error}</p>}
        {message && <p className="notice">{message}</p>}
        {todays.length === 0 && (
          <div className="empty">
            <Bus size={40} />
            <h2>No trips assigned for today</h2>
            <p>Your Admin will assign trips to you.</p>
          </div>
        )}
        {todays.map((t) => (
          <TripCard
            key={t.id}
            trip={t}
            sharing={sharingId === t.id}
            gpsStatus={gpsStatus}
            onStart={startTrip}
            onDelay={markDelayed}
            onComplete={completeTrip}
            onResume={startGps}
            onIssue={reportIssue}
          />
        ))}

        <h2 className="section-title">Previous trips</h2>
        <div className="card table-wrap">
          {history.length === 0 ? (
            <p className="small-note">No previous trips yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Date</th><th>Route</th><th>Bus</th><th>Actual dep. / arr.</th><th>Status</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                {history.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>{t.routeLabel}</td>
                    <td>{t.busNumber}</td>
                    <td>{t.actualDeparture || "-"} / {t.actualArrival || "-"}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{t.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

// Shows the login page until a DRIVER is logged in
function Driver() {
  const { user, profile, loading } = useAuth();
  if (loading) return <p className="container section">Checking login…</p>;
  if (!user || profile?.role !== "driver") return <LoginForm role="driver" />;
  return <DriverDashboard />;
}

export default Driver;
