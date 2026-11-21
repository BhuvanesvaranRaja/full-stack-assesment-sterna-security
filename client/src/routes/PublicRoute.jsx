import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "./constants";

/**
 * Render the public page for guests; redirect signed-in users to the dashboard.
 */
export function PublicRoute({ children }) {
  const { user } = useAuth();

  // Signed-in users do not need to return to the login page.
  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}

export default PublicRoute;
