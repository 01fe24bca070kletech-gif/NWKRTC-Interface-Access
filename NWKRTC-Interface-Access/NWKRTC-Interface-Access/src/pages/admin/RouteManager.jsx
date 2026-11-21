import CrudManager from "../../components/CrudManager.jsx";
import { findCoords } from "../../data/dbHelpers.js";

const fields = [
  { name: "source", label: "Source", required: true, placeholder: "Example: Hubballi" },
  { name: "destination", label: "Destination", required: true, placeholder: "Example: Dharwad" },
  { name: "stops", label: "Intermediate stops (separate with commas)", placeholder: "Navanagar, Unkal" },
  { name: "distanceKm", label: "Distance (km)", type: "number", required: true, min: 1 },
  { name: "durationMin", label: "Estimated duration (minutes)", type: "number", required: true, min: 1 },
  { name: "destLat", label: "Destination latitude (only for places not in the 5 known places)", type: "number" },
  { name: "destLng", label: "Destination longitude (only for places not in the 5 known places)", type: "number" },
];

const columns = [
  { label: "Route", render: (r) => `${r.source} to ${r.destination}` },
  { key: "stops", label: "Stops" },
  { label: "Distance", render: (r) => `${r.distanceKm} km` },
  { label: "Duration", render: (r) => `${r.durationMin} min` },
];

function RouteManager() {
  function beforeSave(values) {
    if (values.source.toLowerCase() === values.destination.toLowerCase())
      throw new Error("Source and destination cannot be the same.");
    const hasCoords = values.destLat !== null && values.destLng !== null;
    if (!hasCoords && !findCoords(values.destination))
      throw new Error(
        "Live tracking needs the destination position. Use Hubballi, Dharwad, Unkal, Navanagar or Sattur, or enter the latitude and longitude."
      );
    return values;
  }

  return <CrudManager title="Routes" path="routes" fields={fields} columns={columns} beforeSave={beforeSave} />;
}

export default RouteManager;
