import { Bus, Users, Route, Navigation, CheckCircle2, CalendarDays, Bell } from "lucide-react";
import { useList, todayString } from "../../data/dbHelpers.js";

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <Icon size={28} />
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

// Every number comes from the database (nothing is typed in by hand)
function AdminDashboard() {
  const { items: buses } = useList("buses");
  const { items: drivers } = useList("drivers");
  const { items: routes } = useList("routes");
  const { items: trips } = useList("trips");
  const { items: notifications } = useList("notifications");

  const active = trips.filter((t) => t.status === "In Progress" || t.status === "Delayed").length;
  const completed = trips.filter((t) => t.status === "Completed").length;
  const today = trips.filter((t) => t.date === todayString()).length;
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <h2 className="section-title">Overview</h2>
      <div className="stat-grid">
        <Stat icon={Bus} label="Total buses" value={buses.length} />
        <Stat icon={Users} label="Total drivers" value={drivers.length} />
        <Stat icon={Route} label="Total routes" value={routes.length} />
        <Stat icon={Navigation} label="Active trips" value={active} />
        <Stat icon={CheckCircle2} label="Completed trips" value={completed} />
        <Stat icon={CalendarDays} label="Today's trips" value={today} />
        <Stat icon={Bell} label="New notifications" value={unread} />
      </div>
    </div>
  );
}

export default AdminDashboard;
