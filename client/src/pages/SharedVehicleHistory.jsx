import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSharedVehicle } from "../services/shareService";

// Format dates consistently for the public view.
const formatDate = (date) => {
  if (!date) {
    return "Not set";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function SharedVehicleHistory() {
  const { shareToken } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [serviceRecords, setServiceRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the shared vehicle using only the public
  // share token. No login or JWT is required.
  useEffect(() => {
    const loadSharedHistory = async () => {
      try {
        const response = await getSharedVehicle(shareToken);

        setVehicle(response.data.vehicle);
        setServiceRecords(response.data.serviceRecords || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load shared vehicle history"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSharedHistory();
  }, [shareToken]);

  return (
    <div className="shared-history-page">
      {/* Public header */}
      <header className="shared-history-navbar">
        <div className="shared-history-navbar-content">
          <strong>CarKeeper</strong>

          <span>Shared Vehicle History</span>
        </div>
      </header>

      <main className="shared-history-container">
        {loading && (
          <div className="garage-message card">
            <p>Loading shared vehicle history...</p>
          </div>
        )}

        {!loading && error && (
          <div className="shared-history-error card">
            <h1>Shared History Unavailable</h1>

            <p>{error}</p>

            <p className="shared-history-error-help">
              The link may be invalid or the vehicle owner may have disabled
              sharing.
            </p>
          </div>
        )}

        {!loading && !error && vehicle && (
          <>
            {/* =========================
                Public Page Heading
                ========================= */}

            <div className="shared-history-heading">
              <p className="shared-history-label">Shared Vehicle History</p>

              <h1>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>

              <p>
                Read-only vehicle and maintenance information shared through
                CarKeeper.
              </p>
            </div>

            {/* =========================
                Vehicle Information
                ========================= */}

            <section className="shared-vehicle-card card">
              <div className="shared-vehicle-header">
                <div>
                  <span>Registration</span>

                  <strong>{vehicle.registration}</strong>
                </div>

                <span className="shared-read-only-badge">Read Only</span>
              </div>

              <div className="shared-vehicle-grid">
                <div className="shared-detail-item">
                  <span>Make / Model</span>

                  <strong>
                    {vehicle.make} {vehicle.model}
                  </strong>
                </div>

                <div className="shared-detail-item">
                  <span>Year</span>

                  <strong>{vehicle.year}</strong>
                </div>

                <div className="shared-detail-item">
                  <span>Transmission</span>

                  <strong>{vehicle.transmission}</strong>
                </div>

                <div className="shared-detail-item">
                  <span>Odometer</span>

                  <strong>{Number(vehicle.mileage).toLocaleString()} km</strong>
                </div>

                <div className="shared-detail-item">
                  <span>WOF Expiry</span>

                  <strong>{formatDate(vehicle.wofExpiry)}</strong>
                </div>

                <div className="shared-detail-item">
                  <span>Registration Expiry</span>

                  <strong>{formatDate(vehicle.registrationExpiry)}</strong>
                </div>
              </div>
            </section>

            {/* =========================
                Service History
                ========================= */}

            <section className="shared-service-history">
              <div className="shared-section-heading">
                <div>
                  <h2>Service History</h2>

                  <p>Maintenance records shared by the vehicle owner.</p>
                </div>

                <span>
                  {serviceRecords.length}{" "}
                  {serviceRecords.length === 1 ? "record" : "records"}
                </span>
              </div>

              {serviceRecords.length === 0 ? (
                <div className="empty-state card">
                  <h3>No service records</h3>

                  <p>
                    No maintenance records have been shared for this vehicle.
                  </p>
                </div>
              ) : (
                <div className="shared-service-list">
                  {serviceRecords.map((record) => (
                    <article
                      key={record._id}
                      className="shared-service-record card"
                    >
                      <div className="shared-service-date">
                        {formatDate(record.date)}
                      </div>

                      <div className="shared-service-content">
                        <h3>{record.serviceType}</h3>

                        <div className="shared-service-meta">
                          <span>
                            {Number(record.mileage).toLocaleString()} km
                          </span>

                          {record.workshop && (
                            <>
                              <span>•</span>

                              <span>{record.workshop}</span>
                            </>
                          )}
                        </div>

                        {record.notes && <p>{record.notes}</p>}
                      </div>

                      <div className="shared-service-cost">
                        ${Number(record.cost || 0).toFixed(2)}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <div className="shared-history-footer-note">
              <p>
                This is a read-only service history shared by the vehicle owner
                through CarKeeper.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default SharedVehicleHistory;
