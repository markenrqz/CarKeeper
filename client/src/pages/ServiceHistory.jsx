import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";

import ServiceRecordCard from "../components/services/ServiceRecordCard";
import ServiceRecordModal from "../components/services/ServiceRecordModal";
import ShareServiceModal from "../components/services/ShareServiceModal";

import { getVehicleById } from "../services/vehicleService";

import {
  createServiceRecord,
  deleteServiceRecord,
  getServiceRecords,
  updateServiceRecord,
} from "../services/serviceRecordService";

// Starting values for a new service record.
const emptyServiceForm = {
  serviceType: "",
  date: "",
  mileage: "",
  cost: "",
  workshop: "",
  notes: "",
};

// Convert a MongoDB date into YYYY-MM-DD
// for an HTML date input.
const formatDateForInput = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().split("T")[0];
};

function ServiceHistory() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [serviceRecords, setServiceRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Controls the reusable Add/Edit Service modal.
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Controls the Share Service History modal.
  const [showShareModal, setShowShareModal] = useState(false);

  const [serviceForm, setServiceForm] = useState(emptyServiceForm);

  const [serviceError, setServiceError] = useState("");

  // A service ID means Edit mode.
  // null means Add mode.
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Load the vehicle and its service history.
  useEffect(() => {
    const loadServiceHistory = async () => {
      try {
        const [vehicleResponse, serviceResponse] = await Promise.all([
          getVehicleById(id),
          getServiceRecords(id),
        ]);

        setVehicle(vehicleResponse.data);
        setServiceRecords(serviceResponse.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load service history"
        );
      } finally {
        setLoading(false);
      }
    };

    loadServiceHistory();
  }, [id]);

  // Update form values while the user types.
  const handleServiceChange = (event) => {
    const { name, value } = event.target;

    setServiceForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  // Open the modal in Add mode.
  const openAddServiceModal = () => {
    setEditingServiceId(null);
    setServiceError("");
    setServiceForm(emptyServiceForm);
    setShowServiceModal(true);
  };

  // Open the same modal in Edit mode.
  const openEditServiceModal = (record) => {
    setEditingServiceId(record._id);
    setServiceError("");

    setServiceForm({
      serviceType: record.serviceType || "",
      date: formatDateForInput(record.date),
      mileage: record.mileage ?? "",
      cost: record.cost ?? "",
      workshop: record.workshop || "",
      notes: record.notes || "",
    });

    setShowServiceModal(true);
  };

  // Close and reset the Add/Edit Service modal.
  const closeServiceModal = () => {
    setShowServiceModal(false);
    setEditingServiceId(null);
    setServiceError("");
    setServiceForm(emptyServiceForm);
  };

  // Open the Share Service History modal.
  const openShareModal = () => {
    setShowShareModal(true);
  };

  // Close the Share Service History modal.
  const closeShareModal = () => {
    setShowShareModal(false);
  };

  // Keep the parent vehicle state in sync whenever
  // sharing is enabled or disabled in the modal.
  const handleShareChange = (shareToken) => {
    setVehicle((currentVehicle) => ({
      ...currentVehicle,
      shareToken,
    }));
  };

  // Handle both Create and Update.
  const handleServiceSubmit = async (event) => {
    event.preventDefault();

    setServiceError("");

    const serviceData = {
      ...serviceForm,

      // Number inputs are returned as strings by HTML.
      mileage: Number(serviceForm.mileage),

      cost: serviceForm.cost === "" ? 0 : Number(serviceForm.cost),
    };

    try {
      if (editingServiceId) {
        // =========================
        // UPDATE
        // =========================

        const response = await updateServiceRecord(
          editingServiceId,
          serviceData
        );

        const updatedRecord = response.data.serviceRecord || response.data;

        setServiceRecords((currentRecords) =>
          currentRecords.map((record) =>
            record._id === editingServiceId ? updatedRecord : record
          )
        );
      } else {
        // =========================
        // CREATE
        // =========================

        const response = await createServiceRecord(id, serviceData);

        const newRecord = response.data.serviceRecord || response.data;

        setServiceRecords((currentRecords) => [newRecord, ...currentRecords]);
      }

      closeServiceModal();
    } catch (error) {
      setServiceError(
        error.response?.data?.message ||
          (editingServiceId
            ? "Unable to update service record"
            : "Unable to add service record")
      );
    }
  };

  // Delete a service record.
  const handleDeleteService = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteServiceRecord(serviceId);

      setServiceRecords((currentRecords) =>
        currentRecords.filter((record) => record._id !== serviceId)
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to delete service record"
      );
    }
  };

  return (
    <>
      <Navbar />

      <PageContainer className="service-history-page">
        <Link to={`/vehicles/${id}`} className="back-link">
          ← Back to Vehicle Details
        </Link>

        {loading && (
          <div className="garage-message card">
            <p>Loading service history...</p>
          </div>
        )}

        {!loading && error && (
          <div className="garage-message card">
            <p className="form-error">{error}</p>
          </div>
        )}

        {!loading && !error && vehicle && (
          <>
            <div className="service-history-header">
              <div>
                <h1>Service History</h1>

                <p>
                  {vehicle.year} {vehicle.make} {vehicle.model} •{" "}
                  {vehicle.registration}
                </p>
              </div>

              <div className="service-history-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={openShareModal}
                >
                  Share Service History
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openAddServiceModal}
                >
                  + Add Service
                </button>
              </div>
            </div>

            {serviceRecords.length === 0 ? (
              <div className="empty-state card">
                <h3>No service records yet</h3>

                <p>
                  Add the first maintenance or service record for this vehicle.
                </p>
              </div>
            ) : (
              <div className="service-record-list">
                {serviceRecords.map((record) => (
                  <ServiceRecordCard
                    key={record._id}
                    record={record}
                    onEdit={openEditServiceModal}
                    onDelete={handleDeleteService}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Add/Edit Service Record modal */}
        {showServiceModal && vehicle && (
          <ServiceRecordModal
            vehicle={vehicle}
            formData={serviceForm}
            onChange={handleServiceChange}
            onSubmit={handleServiceSubmit}
            onClose={closeServiceModal}
            error={serviceError}
            title={
              editingServiceId ? "Edit Service Record" : "Add Service Record"
            }
            submitLabel={
              editingServiceId ? "Save Changes" : "Save Service Record"
            }
          />
        )}

        {/* Share Service History modal */}
        {showShareModal && vehicle && (
          <ShareServiceModal
            vehicle={vehicle}
            onClose={closeShareModal}
            onShareChange={handleShareChange}
          />
        )}
      </PageContainer>
    </>
  );
}

export default ServiceHistory;
