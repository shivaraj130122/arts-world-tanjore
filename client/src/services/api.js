import axios from "axios";

// Central Axios instance. Point VITE_API_BASE_URL at your Express/MERN backend
// in a .env file: VITE_API_BASE_URL=http://localhost:5000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token automatically if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aw_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic centralized error handling hook point for future toast/logging integration.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
