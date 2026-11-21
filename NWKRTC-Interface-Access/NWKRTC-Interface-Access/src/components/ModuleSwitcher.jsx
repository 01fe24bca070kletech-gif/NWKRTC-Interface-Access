import { Link } from "react-router-dom";
import { Users, Bus, ShieldCheck } from "lucide-react";

// Which module is open, based on the web address
export function getArea(pathname) {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/driver")) return "driver";
  return "passenger";
}

const modules = [
  { key: "passenger", to: "/", label: "Passenger", icon: Users },
  { key: "driver", to: "/driver", label: "Driver", icon: Bus },
  { key: "admin", to: "/admin", label: "Admin", icon: ShieldCheck },
];

// Bar at the very top of every page to switch between the 3 modules
function ModuleSwitcher({ area }) {
  return (
    <div className="module-bar">
      <div className="container module-bar-inner">
        {modules.map((m) => (
          <Link
            key={m.key}
            to={m.to}
            className={area === m.key ? "module-link active" : "module-link"}
          >
            <m.icon size={16} /> {m.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ModuleSwitcher;
