import { Link } from "react-router-dom";
import { Bus, Clock, MapPin, Radio } from "lucide-react";

// Shows the details of one bus from the search results
function BusCard({ bus }) {
  return (
    <article className="bus-card">
      <div className="bus-card-top">
        <span className="bus-number">
          <Bus size={22} /> {bus.number}
        </span>
        <span className="bus-direction">
          {bus.from} to {bus.to}
        </span>
      </div>

      <div className="time-grid">
        <div className="time-box">
          <span className="time-label">Departure</span>
          <span className="time-value">{bus.departure}</span>
        </div>
        <div className="time-box">
          <span className="time-label">Arrival</span>
          <span className="time-value">{bus.arrival}</span>
        </div>
        <div className="time-box time-box-orange">
          <span className="time-label">
            <Clock size={15} /> Estimated arrival
          </span>
          <span className="time-value">{bus.estimatedArrival}</span>
        </div>
      </div>

      <div className="stops">
        <span className="stops-title">
          <MapPin size={18} /> Bus stops
        </span>
        <ol className="stops-list">
          {bus.stops.map((stop) => (
            <li
              key={stop}
              className={stop === bus.from || stop === bus.to ? "stop main-stop" : "stop"}
            >
              {stop}
            </li>
          ))}
        </ol>
      </div>

      <Link to={`/live?bus=${bus.number}`} className="btn btn-green btn-small track-btn">
        <Radio size={18} /> Track live
      </Link>
    </article>
  );
}

export default BusCard;
