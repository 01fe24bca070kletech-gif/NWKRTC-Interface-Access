import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ModuleSwitcher, { getArea } from "./components/ModuleSwitcher.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import SearchBuses from "./pages/SearchBuses.jsx";
import About from "./pages/About.jsx";
import RoutesPage from "./pages/RoutesPage.jsx";
import Contact from "./pages/Contact.jsx";
import LiveTracking from "./pages/LiveTracking.jsx";
import Driver from "./pages/Driver.jsx";
import AdminModule from "./pages/admin/AdminModule.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import BusManager from "./pages/admin/BusManager.jsx";
import DriverManager from "./pages/admin/DriverManager.jsx";
import RouteManager from "./pages/admin/RouteManager.jsx";
import ScheduleManager from "./pages/admin/ScheduleManager.jsx";
import TripMonitor from "./pages/admin/TripMonitor.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Notifications from "./pages/admin/Notifications.jsx";
import "./App.css";

function App() {
  const { pathname } = useLocation();
  const { user, profile, logout } = useAuth();
  const area = getArea(pathname);

  // Drivers and admins must log in again every time they open their module:
  // leaving the module (or switching to another one) logs them out.
  useEffect(() => {
    if (user && (area === "passenger" || (profile && profile.role !== area))) {
      logout();
    }
  }, [area, user, profile]);

  return (
    <div className="app">
      <ModuleSwitcher area={area} />
      {area === "passenger" && <Navbar />}
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchBuses />} />
          <Route path="/live" element={<LiveTracking />} />
          <Route path="/about" element={<About />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/driver" element={<Driver />} />

          <Route path="/admin" element={<AdminModule />}>
            <Route index element={<AdminDashboard />} />
            <Route path="buses" element={<BusManager />} />
            <Route path="drivers" element={<DriverManager />} />
            <Route path="routes" element={<RouteManager />} />
            <Route path="schedules" element={<ScheduleManager />} />
            <Route path="trips" element={<TripMonitor />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {area === "passenger" && <Footer />}
    </div>
  );
}

export default App;
