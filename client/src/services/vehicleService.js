import api from "./api";

// Get all vehicles belonging to the logged-in user
export const getVehicles = () => {
  return api.get("/vehicles");
};

// Get one vehicle
export const getVehicleById = (vehicleId) => {
  return api.get(`/vehicles/${vehicleId}`);
};

// Create a vehicle
export const createVehicle = (vehicleData) => {
  return api.post("/vehicles", vehicleData);
};

// Update a vehicle
export const updateVehicle = (vehicleId, vehicleData) => {
  return api.put(`/vehicles/${vehicleId}`, vehicleData);
};

// Delete a vehicle
export const deleteVehicle = (vehicleId) => {
  return api.delete(`/vehicles/${vehicleId}`);
};
