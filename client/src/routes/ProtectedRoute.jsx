import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "./constants";

/**
 * Render children for a signed-in user; otherwise redirect to login.
 */
export function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Replace the history entry so Back does not reopen the blocked page.
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

export default ProtectedRoute;
