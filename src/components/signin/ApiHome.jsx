import axios from "axios";

const BASE_URL = "http://localhost:8080/taxall"; // Change this to your backend URL

// Create an instance of Axios with default settings
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add Authorization token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =========================== Authentication APIs ===========================

export const signUp = (data) => API.post("/auth/signup", data);
export const signIn = (data) => API.post("/auth/signin", data);
export const verifyOtp = (email, otp) =>
  API.post(`/auth/verify-otp?email=${email}&otp=${otp}`);
export const refreshToken = (refreshToken) =>
  API.post("/auth/refresh", { token: refreshToken });
export const getUserRoleByEmail = (email) =>
  API.get(`/auth/users/role?email=${email}`);
export const verifyEmail = (token) =>
  API.get(`/auth/verify-email`, { params: { token } });

// =========================== User APIs ===========================

export const getUserProfile = (id) => API.get(`/userReq/profile/${id}`);
export const getUserIdByEmail = (email) =>
  API.get(`/userReq/user/id`, { params: { email } });

export default API;
