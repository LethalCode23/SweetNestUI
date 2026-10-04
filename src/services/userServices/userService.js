import api from "../api";

// api ya tiene baseURL con /api configurado (mismo patrón que ProfileServices)

export const getUsers = async () => {
  const res = await api.get(`/users/all`);
  return res.data?.data ?? res.data;
};

export const getProfiles = async () => {
  const res = await api.get(`/profile/all`);
  return res.data?.data ?? res.data;
};

export const createUser = async (user) => {
  // La creación de usuario va por el flujo de registro
  const res = await api.post(`/auth/register`, user);
  return res.data?.data ?? res.data;
};

export const updateUser = async (userSec, user) => {
  const res = await api.put(`/users/${userSec}`, user);
  return res.data?.data ?? res.data;
};

export const deleteUser = async (userSec) => {

  console.log(userSec);
  const res = await api.delete(`/users/${userSec}`);

  return res.data?.data ?? res.data;
};