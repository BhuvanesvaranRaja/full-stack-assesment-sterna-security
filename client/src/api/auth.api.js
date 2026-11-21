import apiClient from "./apiClient";

export const authApi = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout", {}),
  getMe: (options = {}) => apiClient.get("/auth/me", options),
};

export default authApi;
