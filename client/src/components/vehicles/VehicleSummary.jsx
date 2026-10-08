import { Link } from "react-router-dom";

import { getVehiclePhotoUrl } from "../../utils/vehiclePhotoUrl";

// Format a stored date into a readable NZ-style date.
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

function VehicleSummary({ vehicle, onDelete }) {
  const vehiclePhotoUrl = getVehiclePhotoUrl(vehicle.photo);

  return (
    <section className="vehicle-summary card">
      {/* Vehicle photo.
          Keep the car icon as a fallback for vehicles
          that do not have an uploaded image. */}
      <div className="vehicle-summary-photo">
        {vehiclePhotoUrl ? (
          <img
            src={vehiclePhotoUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
        ) : (
          <div className="vehicle-summary-photo-placeholder">
            <span aria-hidden="true">🚗</span>
            <span>No vehicle photo</span>
          </div>
        )}
      </div>

      <div className="vehicle-summary-header">
        <div>
          <p className="vehicle-registration">{vehicle.registration}</p>

          <h1>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>

          <p className="vehicle-summary-meta">
            {vehicle.transmission}
            <span>•</span>
            {Number(vehicle.mileage).toLocaleString()} km
          </p>
        </div>

        <div className="vehicle-actions">
          {/* The edit page uses this state to know that
              Edit was opened from Vehicle Details. */}
          <Link
            to={`/vehicles/${vehicle._id}/edit`}
            state={{ from: "details" }}
            className="btn btn-primary"
          >
            Edit Vehicle
          </Link>

          <button type="button" className="btn btn-danger" onClick={onDelete}>
            Delete Vehicle
          </button>
        </div>
      </div>

      <div className="vehicle-detail-grid">
        <div className="vehicle-detail-item">
          <span>Registration</span>
          <strong>{vehicle.registration}</strong>
        </div>

        <div className="vehicle-detail-item">
          <span>Make / Model</span>
          <strong>
            {vehicle.make} {vehicle.model}
          </strong>
        </div>

        <div className="vehicle-detail-item">
          <span>Year</span>
          <strong>{vehicle.year}</strong>
        </div>

        <div className="vehicle-detail-item">
          <span>Transmission</span>
          <strong>{vehicle.transmission}</strong>
        </div>

        <div className="vehicle-detail-item">
          <span>WOF Expiry</span>
          <strong>{formatDate(vehicle.wofExpiry)}</strong>
        </div>

        <div className="vehicle-detail-item">
          <span>Registration Expiry</span>
          <strong>{formatDate(vehicle.registrationExpiry)}</strong>
        </div>

        <div className="vehicle-detail-item">
          <span>Odometer</span>
          <strong>{Number(vehicle.mileage).toLocaleString()} km</strong>
        </div>

        <div className="vehicle-detail-item">
          <span>Next Service</span>
          <strong>
            {vehicle.nextServiceMileage
              ? `${Number(vehicle.nextServiceMileage).toLocaleString()} km`
              : "Not set"}
          </strong>
        </div>
      </div>

      {vehicle.notes && (
        <div className="vehicle-summary-notes">
          <span>Notes</span>
          <p>{vehicle.notes}</p>
        </div>
      )}
    </section>
  );
}

export default VehicleSummary;
