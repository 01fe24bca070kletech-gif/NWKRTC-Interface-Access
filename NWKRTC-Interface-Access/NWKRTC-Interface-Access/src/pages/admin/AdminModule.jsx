import { NavLink, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useList } from "../../data/dbHelpers.js";
import LoginForm from "../../components/LoginForm.jsx";

const tabs = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/buses", label: "Buses" },
  { to: "/admin/drivers", label: "Drivers" },
  { to: "/admin/routes", label: "Routes" },
  { to: "/admin/schedules", label: "Schedules" },
  { to: "/admin/trips", label: "Trip Monitoring" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/notifications", label: "Notifications" },
];

function AdminLayout() {
  const { profile, logout } = useAuth();
  const { items: notifications } = useList("notifications");
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <section className="section">
      <div className="container">
        <div className="driver-head">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Logged in as {profile.name || "Admin"}</p>
          </div>
          <button className="btn btn-green btn-small" onClick={logout}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        <nav className="admin-tabs">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) => (isActive ? "admin-tab active" : "admin-tab")}
            >
              {t.label}
              {t.label === "Notifications" && unread > 0 && <span className="count-dot">{unread}</span>}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </div>
    </section>
  );
}

// Shows the login page until an ADMIN is logged in
function AdminModule() {
  const { user, profile, loading } = useAuth();
  if (loading) return <p className="container section">Checking login…</p>;
  if (!user || profile?.role !== "admin") return <LoginForm role="admin" />;
  return <AdminLayout />;
}

export default AdminModule;
