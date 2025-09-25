import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles: string; // e.g. ["admin", "manager"]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }   

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but unauthorized → redirect or show error
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
