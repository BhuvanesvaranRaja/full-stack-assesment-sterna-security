import apiClient from "@/api/apiClient";

export const locationApi = {
  getLocations: (options = {}) => apiClient.get("/locations", options),
  createLocation: (payload) => apiClient.post("/locations", payload),
};

export default locationApi;
