import { useEffect, useState } from "react";

import { getVehiclePhotoUrl } from "../../utils/vehiclePhotoUrl";

const emptyVehicle = {
  make: "",
  model: "",
  year: "",
  registration: "",
  transmission: "Automatic",
  mileage: "",
  wofExpiry: "",
  registrationExpiry: "",
  nextServiceMileage: "",
  notes: "",
  photo: null,
};

function VehicleForm({
  initialValues = emptyVehicle,
  onSubmit,
  submitLabel = "Save Vehicle",
  onCancel,
  error = "",
}) {
  const [formData, setFormData] = useState(emptyVehicle);

  // Stores the new photo file selected by the user.
  const [photoFile, setPhotoFile] = useState(null);

  // Stores the image URL used for the preview.
  const [photoPreview, setPhotoPreview] = useState(null);

  // Tracks whether an existing vehicle photo should be removed.
  const [removePhoto, setRemovePhoto] = useState(false);

  // Allows the same form to be used when editing a vehicle.
  useEffect(() => {
    setFormData({
      ...emptyVehicle,
      ...initialValues,
    });

    // Convert the stored backend photo path into a complete URL
    // so an existing photo displays correctly on Edit Vehicle.
    setPhotoPreview(getVehiclePhotoUrl(initialValues.photo));

    // Reset photo changes whenever the initial vehicle changes.
    setPhotoFile(null);
    setRemovePhoto(false);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Only allow the same image formats accepted by the backend.
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      event.target.value = "";
      alert("Please select a JPG, PNG or WEBP image.");
      return;
    }

    // Keep the frontend limit consistent with the Multer limit.
    const maximumFileSize = 5 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      event.target.value = "";
      alert("Vehicle photo must be 5 MB or smaller.");
      return;
    }

    setPhotoFile(file);
    setRemovePhoto(false);

    // Create a temporary browser URL so the selected image
    // can be previewed before the vehicle is saved.
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);

    // If this is an existing vehicle, tell the backend
    // that its currently stored photo should be removed.
    setRemovePhoto(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Convert numeric HTML input values before sending
    // them to the parent Add/Edit Vehicle page.
    const vehicleData = {
      ...formData,
      year: Number(formData.year),
      mileage: Number(formData.mileage),

      nextServiceMileage:
        formData.nextServiceMileage === ""
          ? null
          : Number(formData.nextServiceMileage),
    };

    // The parent page will create FormData because file uploads
    // must be sent as multipart/form-data rather than normal JSON.
    onSubmit(vehicleData, photoFile, removePhoto);
  };

  return (
    <form className="vehicle-form card" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="make">Make</label>

          <input
            id="make"
            name="make"
            type="text"
            placeholder="e.g. Mazda"
            value={formData.make}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">Model</label>

          <input
            id="model"
            name="model"
            type="text"
            placeholder="e.g. Axela"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="year">Year</label>

          <input
            id="year"
            name="year"
            type="number"
            min="1900"
            max="2100"
            placeholder="e.g. 2016"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="registration">Registration</label>

          <input
            id="registration"
            name="registration"
            type="text"
            placeholder="e.g. ABC123"
            value={formData.registration}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="transmission">Transmission</label>

          <select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            required
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mileage">Odometer (km)</label>

          <input
            id="mileage"
            name="mileage"
            type="number"
            min="0"
            placeholder="e.g. 88450"
            value={formData.mileage}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="wofExpiry">WOF Expiry</label>

          <input
            id="wofExpiry"
            name="wofExpiry"
            type="date"
            value={formData.wofExpiry || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="registrationExpiry">Registration Expiry</label>

          <input
            id="registrationExpiry"
            name="registrationExpiry"
            type="date"
            value={formData.registrationExpiry || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nextServiceMileage">Next Service Odometer (km)</label>

        <input
          id="nextServiceMileage"
          name="nextServiceMileage"
          type="number"
          min="0"
          placeholder="e.g. 90000"
          value={formData.nextServiceMileage ?? ""}
          onChange={handleChange}
        />
      </div>

      {/* Optional vehicle photo */}
      <div className="form-group vehicle-photo-field">
        <label htmlFor="vehiclePhoto">Vehicle Photo</label>

        <input
          id="vehiclePhoto"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
        />

        <p className="vehicle-photo-help">
          Optional. JPG, PNG or WEBP, maximum 5 MB.
        </p>

        <div className="vehicle-photo-preview">
          {photoPreview ? (
            <img src={photoPreview} alt="Vehicle preview" />
          ) : (
            <div className="vehicle-photo-placeholder">
              <span aria-hidden="true">🚗</span>
              <span>No vehicle photo selected</span>
            </div>
          )}
        </div>

        {photoPreview && (
          <button
            type="button"
            className="btn btn-secondary vehicle-photo-remove"
            onClick={handleRemovePhoto}
          >
            Remove Photo
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>

        <textarea
          id="notes"
          name="notes"
          rows="3"
          placeholder="Optional vehicle notes..."
          value={formData.notes || ""}
          onChange={handleChange}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="vehicle-form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>

        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default VehicleForm;
