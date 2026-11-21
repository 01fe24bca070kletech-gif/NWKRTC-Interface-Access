import CrudManager from "../../components/CrudManager.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { useList, todayString, to12h, findCoords } from "../../data/dbHelpers.js";

const STATUSES = ["Scheduled", "In Progress", "Delayed", "Completed", "Cancelled"];

const columns = [
  { key: "date", label: "Date" },
  { label: "Time", render: (t) => `${to12h(t.departureTime)} - ${to12h(t.arrivalTime)}` },
  { key: "routeLabel", label: "Route" },
  { key: "busNumber", label: "Bus" },
  { key: "driverName", label: "Driver" },
  { label: "Status", render: (t) => <StatusBadge status={t.status} /> },
];

function ScheduleManager() {
  const { items: routes } = useList("routes");
  const { items: buses } = useList("buses");
  const { items: drivers } = useList("drivers");

  const fields = [
    { name: "date", label: "Date", type: "date", required: true },
    { name: "routeId", label: "Route", type: "select", required: true, options: routes.map((r) => ({ value: r.id, label: `${r.source} to ${r.destination}` })) },
    { name: "busId", label: "Bus", type: "select", required: true, options: buses.map((b) => ({ value: b.id, label: `${b.number} (${b.registration})` })) },
    { name: "driverId", label: "Driver", type: "select", required: true, options: drivers.map((d) => ({ value: d.id, label: `${d.driverId} - ${d.name}` })) },
    { name: "departureTime", label: "Departure time", type: "time", required: true },
    { name: "arrivalTime", label: "Arrival time", type: "time", required: true },
    { name: "status", label: "Status", type: "select", noBlank: true, options: STATUSES },
  ];

  function beforeSave(values, editing, trips) {
    if (values.arrivalTime <= values.departureTime) throw new Error("Arrival time must be after departure time.");

    const route = routes.find((r) => r.id === values.routeId);
    const bus = buses.find((b) => b.id === values.busId);
    const driver = drivers.find((d) => d.id === values.driverId);
    if (!route || !bus || !driver) throw new Error("Please choose a route, a bus and a driver.");

    const clash = trips.some(
      (t) =>
        t.id !== editing?.id && t.date === values.date && t.driverId === values.driverId &&
        t.departureTime === values.departureTime
    );
    if (clash) throw new Error("This driver already has a trip at the same time.");

    const coords = route.destLat != null && route.destLng != null
      ? { lat: route.destLat, lng: route.destLng }
      : findCoords(route.destination);

    // Details are copied into the trip so drivers only need to read their own trips
    return {
      date: values.date,
      departureTime: values.departureTime,
      arrivalTime: values.arrivalTime,
      status: values.status || "Scheduled",
      routeId: route.id,
      routeLabel: `${route.source} to ${route.destination}`,
      source: route.source,
      destination: route.destination,
      stops: route.stops || "",
      destLat: coords ? coords.lat : null,
      destLng: coords ? coords.lng : null,
      busId: bus.id,
      busNumber: bus.number,
      busReg: bus.registration,
      driverId: driver.id,
      driverUid: driver.uid,
      driverName: driver.name,
    };
  }

  const missing = routes.length === 0 || buses.length === 0 || drivers.length === 0;

  return (
    <CrudManager
      title="Schedules"
      path="trips"
      fields={fields}
      columns={columns}
      defaults={{ date: todayString(), status: "Scheduled" }}
      beforeSave={beforeSave}
      sortBy={(a, b) => (b.date + b.departureTime).localeCompare(a.date + a.departureTime)}
      hint={missing ? "Add at least one bus, one route and one driver before creating a schedule." : ""}
    />
  );
}

export default ScheduleManager;
