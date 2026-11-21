import axios from "axios";
import { showRequestError } from "./utils";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Notify the auth provider when a session expires; login errors use the request-error toasts.
    const isLoginRequest = error.config?.url?.endsWith("/auth/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    } else {
      showRequestError(error);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
