import { useState } from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { useList, to12h } from "../../data/dbHelpers.js";

const FILTERS = ["All", "Scheduled", "In Progress", "Delayed", "Completed", "Cancelled"];

// Read-only view. It updates by itself when drivers start, delay or complete trips.
function TripMonitor() {
  const { items: trips, loading, error } = useList("trips");
  const [filter, setFilter] = useState("All");

  const shown = trips
    .filter((t) => filter === "All" || t.status === filter)
    .sort((a, b) => (b.date + b.departureTime).localeCompare(a.date + a.departureTime));

  return (
    <div>
      <h2 className="section-title">Trip Monitoring</h2>
      <div className="stops-list chips">
        {FILTERS.map((f) => (
          <button key={f} className={f === filter ? "stop main-stop chip" : "stop chip"} onClick={() => setFilter(f)}>
            {f} ({f === "All" ? trips.length : trips.filter((t) => t.status === f).length})
          </button>
        ))}
      </div>
      {error && <p className="notice">{error}</p>}
      <div className="card table-wrap">
        {loading ? (
          <p>Loading…</p>
        ) : shown.length === 0 ? (
          <p className="small-note">No trips found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Route</th><th>Bus</th><th>Driver</th><th>Scheduled</th>
                <th>Actual</th><th>Status</th><th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.routeLabel}</td>
                  <td>{t.busNumber}</td>
                  <td>{t.driverName}</td>
                  <td>{to12h(t.departureTime)} - {to12h(t.arrivalTime)}</td>
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
  );
}

export default TripMonitor;
