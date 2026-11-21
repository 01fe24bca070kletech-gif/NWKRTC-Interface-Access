import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Bus, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Search Buses" },
  { to: "/live", label: "Live Map" },
  { to: "/about", label: "About" },
  { to: "/routes", label: "Routes" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-icon">
            <Bus size={24} />
          </span>
          <span>
            NWKRTC <strong>BusTrack</strong>
          </span>
        </Link>

        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={open ? "nav-links open" : "nav-links"}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
