import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ requiredSubModule, children }) => {

  const { user, loadingModules, hasSubmodulePermission } = useAuth();
  const location = useLocation();

  if (!user) {
    // El login vuelve a esta página (state.from)
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Esperamos a que los módulos terminen de cargar antes de evaluar permisos
  if (requiredSubModule && loadingModules) {
    return null; // o un spinner si prefieres feedback visual
  }

  if (requiredSubModule && !hasSubmodulePermission(requiredSubModule)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};