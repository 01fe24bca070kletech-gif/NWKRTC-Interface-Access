import { ref, update, remove } from "firebase/database";
import { Bell, Check, Trash2 } from "lucide-react";
import { db } from "../../firebase.js";
import { useList } from "../../data/dbHelpers.js";

// Issues and delays reported by drivers appear here instantly
function Notifications() {
  const { items, loading, error } = useList("notifications");
  const sorted = [...items].sort((a, b) => b.time - a.time);

  return (
    <div>
      <h2 className="section-title">Notifications</h2>
      {error && <p className="notice">{error}</p>}
      {loading && <p>Loading…</p>}
      {!loading && sorted.length === 0 && (
        <div className="empty">
          <Bell size={40} />
          <h2>No notifications</h2>
          <p>Reports from drivers will appear here.</p>
        </div>
      )}
      {sorted.map((n) => (
        <article key={n.id} className={n.read ? "note-card" : "note-card unread"}>
          <div>
            <strong>{n.type}</strong> - {n.busNumber} ({n.routeLabel})
            <p>{n.message}</p>
            <small>
              Driver: {n.driverName} • {new Date(n.time).toLocaleString("en-IN")}
            </small>
          </div>
          <div className="row-actions">
            {!n.read && (
              <button className="icon-btn" title="Mark as read" onClick={() => update(ref(db, `notifications/${n.id}`), { read: true })}>
                <Check size={18} />
              </button>
            )}
            <button className="icon-btn danger" title="Delete" onClick={() => remove(ref(db, `notifications/${n.id}`))}>
              <Trash2 size={18} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Notifications;
