import api from "./api";

// Enable public sharing for a vehicle.
// The API returns the vehicle's share token.
export const enableVehicleSharing = (vehicleId) =>
  api.post(`/vehicles/${vehicleId}/share`);

// Disable public sharing for a vehicle.
// The existing public link will no longer work.
export const disableVehicleSharing = (vehicleId) =>
  api.delete(`/vehicles/${vehicleId}/share`);

// Get a publicly shared vehicle and its service history.
// This endpoint does not require authentication.
export const getSharedVehicle = (shareToken) =>
  api.get(`/public/vehicles/${shareToken}`);
