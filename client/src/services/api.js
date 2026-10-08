import axios from "axios";

// Base URL for all CarKeeper API requests.
export const API_BASE_URL = "http://localhost:5000/api";

// The server origin is also used when displaying uploaded files.
// Example:
// /uploads/vehicles/car.jpg
// becomes:
// http://localhost:5000/uploads/vehicles/car.jpg
export const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

// Create one reusable Axios instance for all CarKeeper API requests.
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Before each request, check whether the user has a JWT.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Protected backend routes expect:
  // Authorization: Bearer <token>
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
