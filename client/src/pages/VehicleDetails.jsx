import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";
import VehicleSummary from "../components/vehicles/VehicleSummary";

import api from "../services/api";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [serviceRecords, setServiceRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the vehicle and its service records.
  // The service records are used here only to show
  // a small summary before opening the full history.
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const [vehicleResponse, serviceResponse] = await Promise.all([
          api.get(`/vehicles/${id}`),
          api.get(`/vehicles/${id}/services`),
        ]);

        setVehicle(vehicleResponse.data);
        setServiceRecords(serviceResponse.data);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load vehicle");
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  // Delete the vehicle.
  const handleDeleteVehicle = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/vehicles/${id}`);

      navigate("/garage");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to delete vehicle");
    }
  };

  return (
    <>
      <Navbar />

      <PageContainer className="vehicle-details-page">
        <Link to="/garage" className="back-link">
          ← Back to My Garage
        </Link>

        {/* Loading state */}
        {loading && (
          <div className="garage-message card">
            <p>Loading vehicle...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="garage-message card">
            <p className="form-error">{error}</p>
          </div>
        )}

        {/* Vehicle Details */}
        {!loading && !error && vehicle && (
          <>
            <VehicleSummary vehicle={vehicle} onDelete={handleDeleteVehicle} />

            {/* Link into the dedicated Service History page */}
            <section className="vehicle-service-summary card">
              <div>
                <h2>Service History</h2>

                <p>
                  {serviceRecords.length === 0
                    ? "No service records have been added yet."
                    : `${serviceRecords.length} service ${
                        serviceRecords.length === 1 ? "record" : "records"
                      } saved for this vehicle.`}
                </p>
              </div>

              <Link to={`/vehicles/${id}/services`} className="btn btn-primary">
                View Service History
              </Link>
            </section>
          </>
        )}
      </PageContainer>
    </>
  );
}

export default VehicleDetails;
