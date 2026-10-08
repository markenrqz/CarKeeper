import api from "./api";

// Get all service records belonging to one vehicle.
export const getServiceRecords = (vehicleId) =>
  api.get(`/vehicles/${vehicleId}/services`);

// Create a service record for a vehicle.
export const createServiceRecord = (vehicleId, serviceData) =>
  api.post(`/vehicles/${vehicleId}/services`, serviceData);

// Update an existing service record.
export const updateServiceRecord = (serviceId, serviceData) =>
  api.put(`/services/${serviceId}`, serviceData);

// Delete an existing service record.
export const deleteServiceRecord = (serviceId) =>
  api.delete(`/services/${serviceId}`);
