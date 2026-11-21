function StatusBadge({ status }) {
  const name = (status || "Scheduled").toLowerCase().replace(" ", "-");
  return <span className={`badge badge-${name}`}>{status || "Scheduled"}</span>;
}

export default StatusBadge;
