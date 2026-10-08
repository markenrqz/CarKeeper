import { Link } from "react-router-dom";

// Format dates consistently for the dashboard.
const formatDate = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function UpcomingItems({ items }) {
  return (
    <section className="dashboard-section card">
      <div className="dashboard-section-header">
        <div>
          <h2>Upcoming Items</h2>

          <p>WOF, registration and service items to keep an eye on.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="dashboard-empty-state">
          <p>No upcoming items.</p>
        </div>
      ) : (
        <div className="upcoming-item-list">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/vehicles/${item.vehicleId}`}
              className="upcoming-item"
            >
              <div className="upcoming-item-type">
                <span
                  className={`upcoming-item-icon upcoming-item-icon-${item.type}`}
                >
                  {item.icon}
                </span>
              </div>

              <div className="upcoming-item-content">
                <strong>{item.title}</strong>

                <span>{item.vehicleName}</span>
              </div>

              <div className="upcoming-item-value">
                {item.date ? formatDate(item.date) : item.value}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingItems;
