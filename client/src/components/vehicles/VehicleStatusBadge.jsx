function VehicleStatusBadge({ label, value, type = "default" }) {
  // Don't render an empty badge when the vehicle
  // doesn't have this information yet.
  if (!value) {
    return null;
  }

  return (
    <span className={`status-badge status-badge-${type}`}>
      <strong>{label}:</strong> {value}
    </span>
  );
}

export default VehicleStatusBadge;
