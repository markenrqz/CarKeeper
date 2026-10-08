import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";
import VehicleForm from "../components/vehicles/VehicleForm";
import { createVehicle } from "../services/vehicleService";

function AddVehicle() {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  // Build multipart/form-data so normal vehicle information
  // and the optional image file can be sent in one request.
  const buildVehicleFormData = (vehicleData, photoFile) => {
    const formData = new FormData();

    Object.entries(vehicleData).forEach(([key, value]) => {
      // Do not send the photo property from the vehicle object.
      // The actual image file is added separately below.
      if (key === "photo") {
        return;
      }

      // Skip undefined values.
      if (value === undefined) {
        return;
      }

      // FormData cannot directly represent null,
      // so optional null values are sent as empty strings.
      formData.append(key, value === null ? "" : value);
    });

    // The field name must be "photo" because the backend
    // uses uploadVehiclePhoto.single("photo").
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    return formData;
  };

  const handleCreateVehicle = async (vehicleData, photoFile) => {
    try {
      setError("");

      const formData = buildVehicleFormData(vehicleData, photoFile);

      await createVehicle(formData);

      // Return to My Garage after successfully adding the vehicle.
      navigate("/garage");
    } catch (err) {
      console.error("Create vehicle error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to add vehicle. Please try again."
      );
    }
  };

  const handleCancel = () => {
    navigate("/garage");
  };

  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="page-heading">
          <div>
            <h1>Add Vehicle</h1>

            <p>
              Add your vehicle details to start tracking maintenance and service
              history.
            </p>
          </div>
        </div>

        <VehicleForm
          onSubmit={handleCreateVehicle}
          submitLabel="Add Vehicle"
          onCancel={handleCancel}
          error={error}
        />
      </PageContainer>
    </>
  );
}

export default AddVehicle;
