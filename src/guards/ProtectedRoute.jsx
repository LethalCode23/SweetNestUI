import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ requiredSubModule, children }) => {

  const { user, loadingModules, hasSubmodulePermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
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