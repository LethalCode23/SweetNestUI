import { createContext, useContext, useState } from "react";
import { getProfileModules } from "../services/profileServices/ProfileServices";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [modules, setModules] = useState(() => {
    const stored = localStorage.getItem("modules");
    return stored ? JSON.parse(stored) : [];
  });

  const [loadingModules, setLoadingModules] = useState(false);

  /**
   * Llamado tras un login exitoso.
   * loginData = { user: {...}, auth: { token } }
   */
  const saveUser = async (loginData) => {

    localStorage.setItem("user", JSON.stringify(loginData.user));
    localStorage.setItem("token", loginData.auth.token);
    setUser(loginData.user);

    // Cargar modulos segun el perfil del usuario
    const proId = loginData.user?.profile?.proId;
    if (proId) {
      setLoadingModules(true);
      try {
        const fetchedModules = await getProfileModules(proId);
        const moduleArray = Array.isArray(fetchedModules) ? fetchedModules : [];
        setModules(moduleArray);
        localStorage.setItem("modules", JSON.stringify(moduleArray));
      } catch (err) {
        console.error("No se pudieron cargar los modulos del perfil:", err);
        setModules([]);
        localStorage.removeItem("modules");
      } finally {
        setLoadingModules(false);
      }
    }
  };

  const logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("modules");

    setUser(null);
    setModules([]);
  };

  /**
   * Verifica si el perfil actual tiene acceso a un submódulo puntual,
   * usando los modules ya cargados desde el backend (entryAllowed + subModules).
   */
  const hasSubmodulePermission = (subModuleName) => {

    if (!modules || modules.length === 0) return false;

    return modules.some(
      (module) =>
        module.entryAllowed &&
        module.subModules?.some((sub) => sub.name === subModuleName)
    );
  };

  const hasActionPermission = (subModuleName, actionCode) => {

    if (!modules || modules.length === 0) return false;

    for (const module of modules) {
      if (!module.entryAllowed) continue;

      const subModule = module.subModules?.find((sub) => sub.name === subModuleName);
      if (!subModule) continue;

      const action = subModule.actions?.find((a) => a.code === actionCode);
      return action?.allowed ?? false;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        saveUser,
        logout,
        modules,
        loadingModules,
        hasSubmodulePermission,
        hasActionPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);