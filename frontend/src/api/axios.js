import axios from "axios";

/*
 Central Axios instance
 Automatically attaches JWT token if present
*/
const api = axios.create({
  baseURL: "http://localhost:8080", // backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;