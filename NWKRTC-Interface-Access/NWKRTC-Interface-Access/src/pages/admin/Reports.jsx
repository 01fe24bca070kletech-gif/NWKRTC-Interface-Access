import { useState } from "react";
import { Printer } from "lucide-react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { useList, todayString, to12h } from "../../data/dbHelpers.js";

// Groups trips by something (driver, bus or route) and counts the statuses
function group(trips, keyFn) {
  const map = {};
  trips.forEach((t) => {
    const k = keyFn(t) || "Unknown";
    map[k] = map[k] || { name: k, total: 0, completed: 0, delayed: 0, cancelled: 0 };
    map[k].total++;
    if (t.status === "Completed") map[k].completed++;
    if (t.status === "Cancelled") map[k].cancelled++;
    if (t.wasDelayed || t.status === "Delayed") map[k].delayed++;
  });
  return Object.values(map);
}

function SummaryTable({ label, rows }) {
  return (
    <table className="data-table">
      <thead>
        <tr><th>{label}</th><th>Total trips</th><th>Completed</th><th>Delayed</th><th>Cancelled</th></tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr><td colSpan="5">No data.</td></tr>
        )}
        {rows.map((r) => (
          <tr key={r.name}>
            <td>{r.name}</td><td>{r.total}</td><td>{r.completed}</td><td>{r.delayed}</td><td>{r.cancelled}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Reports() {
  const { items: trips } = useList("trips");
  const [type, setType] = useState("daily");
  const [date, setDate] = useState(todayString());

  const dayTrips = trips.filter((t) => t.date === date).sort((a, b) => a.departureTime.localeCompare(b.departureTime));

  return (
    <div>
      <div className="manager-head">
        <h2 className="section-title">Reports</h2>
        <button className="btn btn-light btn-small no-print" onClick={() => window.print()}>
          <Printer size={18} /> Print
        </button>
      </div>

      <div className="card no-print report-controls">
        <div className="field">
          <label htmlFor="reportType">REPORT</label>
          <select id="reportType" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="daily">Daily trip report</option>
            <option value="driver">Driver report</option>
            <option value="bus">Bus report</option>
            <option value="route">Route-wise report</option>
          </select>
        </div>
        {type === "daily" && (
          <div className="field">
            <label htmlFor="reportDate">DATE</label>
            <input id="reportDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        )}
      </div>

      <div className="card table-wrap">
        {type === "daily" && (
          <>
            <p className="small-note">Trips on {date}: {dayTrips.length}</p>
            <table className="data-table">
              <thead>
                <tr><th>Time</th><th>Route</th><th>Bus</th><th>Driver</th><th>Actual dep. / arr.</th><th>Status</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                {dayTrips.length === 0 && (
                  <tr><td colSpan="7">No trips on this date.</td></tr>
                )}
                {dayTrips.map((t) => (
                  <tr key={t.id}>
                    <td>{to12h(t.departureTime)} - {to12h(t.arrivalTime)}</td>
                    <td>{t.routeLabel}</td>
                    <td>{t.busNumber}</td>
                    <td>{t.driverName}</td>
                    <td>{t.actualDeparture || "-"} / {t.actualArrival || "-"}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{t.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {type === "driver" && <SummaryTable label="Driver" rows={group(trips, (t) => t.driverName)} />}
        {type === "bus" && <SummaryTable label="Bus" rows={group(trips, (t) => `${t.busNumber} (${t.busReg})`)} />}
        {type === "route" && <SummaryTable label="Route" rows={group(trips, (t) => t.routeLabel)} />}
      </div>
    </div>
  );
}

export default Reports;
