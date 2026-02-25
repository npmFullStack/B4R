// src/services/api.js (updated)
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Public API instance (no auth interceptors)
export const publicAPI = axios.create({
  baseURL: "http://localhost:5000/api/public",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (userData) => API.post("/auth/register", userData),
  login: (credentials) => API.post("/auth/login", credentials),
  getProfile: () => API.get("/auth/profile"),
};

export const propertyAPI = {
  // Protected property endpoints
  getUserProperties: () => API.get("/properties"),
  getPropertyById: (id) => API.get(`/properties/${id}`),
  createProperty: (formData) =>
    API.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateProperty: (id, formData) =>
    API.put(`/properties/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProperty: (id) => API.delete(`/properties/${id}`),
  deleteImage: (propertyId, imageName) =>
    API.delete(`/properties/${propertyId}/images/${imageName}`),

  // Property Rules endpoints
  getPropertyRules: (propertyId) => API.get(`/properties/${propertyId}/rules`),
  addPropertyRule: (propertyId, ruleName) =>
    API.post(`/properties/${propertyId}/rules`, { rule_name: ruleName }),
  addMultiplePropertyRules: (propertyId, rules) =>
    API.post(`/properties/${propertyId}/rules/bulk`, { rules }),
  updatePropertyRule: (propertyId, ruleId, ruleName) =>
    API.put(`/properties/${propertyId}/rules/${ruleId}`, {
      rule_name: ruleName,
    }),
  deletePropertyRule: (propertyId, ruleId) =>
    API.delete(`/properties/${propertyId}/rules/${ruleId}`),
  deleteAllPropertyRules: (propertyId) =>
    API.delete(`/properties/${propertyId}/rules`),
};

// Public endpoints (no auth required)
export const publicPropertyAPI = {
  searchProperties: (params) => publicAPI.get("/properties/search", { params }),
  getPropertyById: (id) => publicAPI.get(`/properties/${id}`),
  getCities: () => publicAPI.get("/properties/cities"),
};

export default API;
