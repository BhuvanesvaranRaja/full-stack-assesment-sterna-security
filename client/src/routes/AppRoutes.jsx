import { Navigate, Route, Routes } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "./constants";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Locations from "@/pages/locations";

/**
 * Wait for session loading, then render public or protected pages and redirect unknown paths.
 */
export function AppRoutes() {
  const { user, loading } = useAuth();

  // Wait for the session check before deciding which page the user can open.
  if (loading) {
    return (
      <div className="global-loading" role="status" aria-label="Loading">
        <LoaderCircle className="spinner" size={42} strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.LOCATIONS}
        element={
          <ProtectedRoute>
            <Locations />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />
        }
      />
    </Routes>
  );
}

export default AppRoutes;
