import api from "../api";

/**
 * Obtiene los modulos permitidos para un perfil dado.
 * El Bearer token se adjunta automaticamente via el interceptor de api.js.
 *
 * @param {number|string} proId - ID del perfil (viene de user.profile.proId tras el login)
 * @returns {Promise<Array>} Array de modulos { moduleName, entryAllowed, subModules[] }
 */
export const getProfileModules = async (proId) => {

  const res = await api.get(`/profiles/${proId}/modules`);

  // El backend devuelve { code, data: [...], message, success }
  return res.data?.data ?? res.data;
};

/**
 * Obtiene la lista completa de perfiles del sistema.
 *
 * @returns {Promise<Array>} Array de perfiles { proId, proName, proState, isDefault }
 */
export const getAllProfiles = async () => {

  const res = await api.get(`/profile/all`);

  // El backend devuelve { code, data: [...], message, success }
  return res.data?.data ?? res.data;
};