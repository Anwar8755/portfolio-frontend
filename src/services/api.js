import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach token if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Login function for Admin
export const loginAdmin = async (username, password) => {
  const res = await API.post("/auth/login", { username, password });
  return res.data;
};

export default API;
