import { Link } from "react-router-dom";

// Format service dates for display.
const formatDate = (date) => {
  if (!date) {
    return "Date not set";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function RecentMaintenance({ records }) {
  return (
    <section className="dashboard-section card">
      <div className="dashboard-section-header">
        <div>
          <h2>Recent Maintenance</h2>

          <p>Your latest vehicle maintenance records.</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="dashboard-empty-state">
          <p>No maintenance records yet.</p>
        </div>
      ) : (
        <div className="recent-maintenance-list">
          {records.map((record) => (
            <Link
              key={record._id}
              to={`/vehicles/${record.vehicleId}/services`}
              className="recent-maintenance-item"
            >
              <div className="recent-maintenance-date">
                {formatDate(record.date)}
              </div>

              <div className="recent-maintenance-content">
                <strong>{record.serviceType}</strong>

                <span>{record.vehicleName}</span>
              </div>

              <div className="recent-maintenance-mileage">
                {Number(record.mileage).toLocaleString()} km
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentMaintenance;
