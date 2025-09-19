import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE + "/api",
  headers: { "Content-Type": "application/json" },
  // withCredentials: true // not required for token-based auth
});

// helper to attach token
export function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export default api;
