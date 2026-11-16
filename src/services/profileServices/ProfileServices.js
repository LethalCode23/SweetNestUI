import api from "../api";

// Controlador: RbacController
export const getProfileModules = async (proId) => {
  const res = await api.get(`/profiles/${proId}/modules`);
  return res.data?.data ?? res.data;
};

// Controlador: RbacController
export const updateEntryAllowed = async (profileId, moduleId, entryAllowed) => {
  const res = await api.patch(
    `/profiles/${profileId}/modules/${moduleId}/entry-allowed`,
    { entryAllowed }
  );
  return res.data?.data ?? res.data;
};

// Controlador: RbacController
export const updateActionAllowed = async (profileId, moduleId, subModuleId, code, allowed) => {
  const res = await api.patch(
    `/profiles/${profileId}/modules/${moduleId}/submodules/${subModuleId}/actions/${code}`,
    { allowed }
  );
  return res.data?.data ?? res.data;
};

// Controlador: PermissionProfilesModuleController
export const grantSubModule = async (profileId, moduleId, subModuleId) => {
  const res = await api.post(
    `/PermissionProMod/${profileId}/modules/${moduleId}/submodules/${subModuleId}`
  );
  return res.data?.data ?? res.data;
};

// Controlador: PermissionProfilesModuleController
export const revokeSubModule = async (profileId, moduleId, subModuleId) => {
  const res = await api.delete(
    `/PermissionProMod/${profileId}/modules/${moduleId}/submodules/${subModuleId}`
  );
  return res.data?.data ?? res.data;
};

// Controlador: ProfileController
export const getAllProfiles = async () => {
  const res = await api.get(`/profile/all`);
  return res.data?.data ?? res.data;
};

// Controlador: ProfileController (DTO crudo, sin ApiResponse)
// payload: { proName, proState: 'A'|'I', isDefault: 'S'|'N', hasControlAccess: 'S'|'N' }
export const createProfile = async (payload) => {
  const res = await api.post(`/profile/save`, payload);
  return res.data;
};

// Controlador: ProfileController. 400 (1001) si se desmarca el único perfil por defecto.
export const updateProfile = async (proId, payload) => {
  const res = await api.put(`/profile/${proId}`, payload);
  return res.data;
};