import { useContext } from "react";
import { AuthContext } from "@/auth/auth-context";

/**
 * Return the shared auth state and actions; throw if called outside AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;
