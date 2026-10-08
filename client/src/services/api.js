import axios from "axios";

// Use the deployed API URL when VITE_API_URL is provided.
// Otherwise, use the local Express server during development.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Remove "/api" so uploaded vehicle photos can use
// the same backend server address.
export const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add the user's JWT to protected API requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
