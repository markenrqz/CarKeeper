import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";
import VehicleForm from "../components/vehicles/VehicleForm";

import { getVehicleById, updateVehicle } from "../services/vehicleService";

// Convert MongoDB dates into the YYYY-MM-DD format
// required by HTML date inputs.
const formatDateForInput = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().split("T")[0];
};

// Build multipart/form-data so vehicle information,
// an optional replacement photo, and the remove-photo
// instruction can all be sent in one request.
const buildVehicleFormData = (vehicleData, photoFile, removePhoto) => {
  const formData = new FormData();

  // These values come from MongoDB but should never
  // be submitted as editable vehicle fields.
  const excludedFields = [
    "_id",
    "owner",
    "photo",
    "shareToken",
    "createdAt",
    "updatedAt",
    "__v",
  ];

  Object.entries(vehicleData).forEach(([key, value]) => {
    if (excludedFields.includes(key)) {
      return;
    }

    if (value === undefined) {
      return;
    }

    // FormData cannot directly represent null,
    // so optional null values are sent as empty strings.
    formData.append(key, value === null ? "" : value);
  });

  // If the user selected a new image, send it using
  // the "photo" field expected by Multer.
  if (photoFile) {
    formData.append("photo", photoFile);
  }

  // Tell the backend whether the existing photo
  // should be deliberately removed.
  formData.append("removePhoto", removePhoto ? "true" : "false");

  return formData;
};

function EditVehicle() {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check where the user opened Edit Vehicle from.
  //
  // "garage"  = My Garage
  // "details" = Vehicle Details
  //
  // If someone directly opens the edit URL,
  // default to Vehicle Details.
  const editSource = location.state?.from || "details";

  // Load the existing vehicle.
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const response = await getVehicleById(id);

        const existingVehicle = response.data;

        setVehicle({
          ...existingVehicle,

          // HTML date inputs require YYYY-MM-DD.
          wofExpiry: formatDateForInput(existingVehicle.wofExpiry),

          registrationExpiry: formatDateForInput(
            existingVehicle.registrationExpiry
          ),
        });
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load vehicle");
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  // Save the updated vehicle.
  const handleUpdateVehicle = async (vehicleData, photoFile, removePhoto) => {
    setError("");

    try {
      const formData = buildVehicleFormData(
        vehicleData,
        photoFile,
        removePhoto
      );

      await updateVehicle(id, formData);

      // Saving always takes the user to Vehicle Details,
      // regardless of where Edit was opened from.
      navigate(`/vehicles/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to update vehicle");
    }
  };

  // Decide where Cancel should return the user.
  const handleCancel = () => {
    if (editSource === "garage") {
      // Edit opened from My Garage:
      // Cancel → My Garage.
      navigate("/garage");
      return;
    }

    // Edit opened from Vehicle Details:
    // Cancel → Vehicle Details.
    navigate(`/vehicles/${id}`);
  };

  return (
    <>
      <Navbar />

      <PageContainer className="vehicle-form-page">
        <div className="page-heading">
          <h1>Edit Vehicle</h1>

          <p>Update your vehicle information and maintenance details.</p>
        </div>

        {loading ? (
          <div className="garage-message card">
            <p>Loading vehicle...</p>
          </div>
        ) : vehicle ? (
          <VehicleForm
            initialValues={vehicle}
            onSubmit={handleUpdateVehicle}
            onCancel={handleCancel}
            submitLabel="Save Changes"
            error={error}
          />
        ) : (
          <div className="garage-message card">
            <p>{error || "Vehicle could not be found."}</p>
          </div>
        )}
      </PageContainer>
    </>
  );
}

export default EditVehicle;
