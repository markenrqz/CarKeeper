import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";
import VehicleCard from "../components/vehicles/VehicleCard";

import { deleteVehicle, getVehicles } from "../services/vehicleService";

function Garage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all vehicles belonging to the logged-in user
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await getVehicles();

        setVehicles(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load your vehicles"
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // Delete a vehicle after asking the user for confirmation
  const handleDeleteVehicle = async (vehicle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${vehicle.year} ${vehicle.make} ${vehicle.model}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVehicle(vehicle._id);

      // Remove the vehicle from the UI without
      // needing to reload the whole page.
      setVehicles((currentVehicles) =>
        currentVehicles.filter(
          (currentVehicle) => currentVehicle._id !== vehicle._id
        )
      );
    } catch (error) {
      setError(error.response?.data?.message || "Unable to delete vehicle");
    }
  };

  return (
    <>
      <Navbar />

      <PageContainer className="garage-page">
        {/* Page heading */}
        <div className="garage-header">
          <div>
            <h1>My Garage</h1>

            <p>Manage all your vehicles in one place.</p>
          </div>

          <Link to="/vehicles/add" className="btn btn-primary">
            + Add Vehicle
          </Link>
        </div>

        {/* API error */}
        {error && <p className="form-error">{error}</p>}

        {/* Loading state */}
        {loading ? (
          <div className="garage-message card">
            <p>Loading your vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty garage */
          <div className="garage-empty card">
            <div className="garage-empty-icon">🚗</div>

            <h2>Your garage is empty</h2>

            <p>
              Add your first vehicle to start tracking maintenance and service
              history.
            </p>

            <Link to="/vehicles/add" className="btn btn-primary">
              + Add Vehicle
            </Link>
          </div>
        ) : (
          /* Vehicle list */
          <div className="vehicle-list">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onDelete={handleDeleteVehicle}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}

export default Garage;
