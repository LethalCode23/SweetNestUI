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