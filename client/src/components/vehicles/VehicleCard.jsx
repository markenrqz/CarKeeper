import { Link } from "react-router-dom";

import VehicleStatusBadge from "./VehicleStatusBadge";
import { getVehiclePhotoUrl } from "../../utils/vehiclePhotoUrl";

// Convert a MongoDB date into a readable NZ-style date.
const formatDate = (date) => {
  if (!date) {
    return null;
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function VehicleCard({ vehicle, onDelete }) {
  const vehiclePhotoUrl = getVehiclePhotoUrl(vehicle.photo);

  return (
    <article className="vehicle-card card">
      {/* Show the uploaded vehicle photo when one exists.
          Otherwise keep the existing car icon as a fallback. */}
      <div className="vehicle-card-image">
        {vehiclePhotoUrl ? (
          <img
            src={vehiclePhotoUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
        ) : (
          <span aria-hidden="true">🚗</span>
        )}
      </div>

      {/* Main vehicle information */}
      <div className="vehicle-card-content">
        <h2>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h2>

        <p className="vehicle-card-meta">
          {vehicle.transmission}
          <span>•</span>
          {Number(vehicle.mileage).toLocaleString()} km
        </p>

        <div className="vehicle-card-status">
          <VehicleStatusBadge
            label="WOF"
            value={formatDate(vehicle.wofExpiry)}
            type="wof"
          />

          <VehicleStatusBadge
            label="Rego"
            value={formatDate(vehicle.registrationExpiry)}
            type="rego"
          />
        </div>
      </div>

      {/* Vehicle actions */}
      <div className="vehicle-card-actions">
        <Link to={`/vehicles/${vehicle._id}`} className="btn btn-primary">
          View
        </Link>

        {/* Tell EditVehicle that Edit was opened
            from the My Garage page. */}
        <Link
          to={`/vehicles/${vehicle._id}/edit`}
          state={{ from: "garage" }}
          className="btn btn-secondary"
        >
          Edit
        </Link>

        <button
          type="button"
          className="btn btn-secondary vehicle-delete-button"
          onClick={() => onDelete(vehicle)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default VehicleCard;
