import { Link } from "react-router-dom";
import { MapPin, Flag } from "lucide-react";

// Shows one route: starting point, stops and destination.
// The button opens the Search page with FROM and TO already selected.
function RouteCard({ route }) {
  return (
    <article className="route-card">
      <div className="route-point">
        <MapPin size={20} />
        <div>
          <small>Starting point</small>
          <strong>{route.from}</strong>
        </div>
      </div>

      <div className="route-stops">
        {route.stops.length > 0 ? route.stops.join("  •  ") : "No stops in between"}
      </div>

      <div className="route-point">
        <Flag size={20} />
        <div>
          <small>Destination</small>
          <strong>{route.to}</strong>
        </div>
      </div>

      <Link
        to={`/search?from=${route.from}&to=${route.to}`}
        className="btn btn-green btn-small"
      >
        Find buses
      </Link>
    </article>
  );
}

export default RouteCard;
