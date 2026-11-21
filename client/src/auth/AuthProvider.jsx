import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "@/api/auth.api";
import { AuthContext } from "./auth-context";

/**
 * Restore the session on startup and share auth state, clearing it when an API request returns 401.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track an active session so expired-session alerts only appear after sign-in.
  const sessionActive = useRef(false);

  // On mount, check for an existing session and finish loading when the request settles.
  useEffect(() => {
    const controller = new AbortController();

    authApi
      .getMe({ signal: controller.signal })
      .then((response) => {
        sessionActive.current = Boolean(response.data.user);
        setUser(response.data.user);
      })
      .catch((error) => {
        if (!controller.signal.aborted && error.response?.status !== 401) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    // Cancel the request when this effect is cleaned up to avoid stale state updates.
    return () => controller.abort();
  }, []);

  // Listen for API 401 events, clear the user, and notify them if their session was active.
  useEffect(() => {
    const clearSession = () => {
      if (sessionActive.current) {
        sessionActive.current = false;
        toast.error("Your session has expired. Please sign in again.", {
          id: "api-unauthorized",
        });
      }
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", clearSession);
    // Remove the listener on cleanup so it is not left registered after unmount.
    return () => window.removeEventListener("auth:unauthorized", clearSession);
  }, []);

  /**
   * Sign in with the supplied credentials, store the returned user, and return that user.
   */
  async function login(credentials) {
    const response = await authApi.login(credentials);
    sessionActive.current = true;
    setUser(response.data.user);
    return response.data.user;
  }

  /**
   * Ask the server to clear the session, then remove the user from local state.
   */
  async function logout() {
    await authApi.logout();
    sessionActive.current = false;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
