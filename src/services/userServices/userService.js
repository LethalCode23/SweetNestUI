import { Environment } from "../../Environments/Environment";
import api from "../api";

const BASE = Environment.API_URL + '/user';

export const getUsers = async () => {
  const res = await api.get(`${BASE}/all`);
  return res.data;
};

export const getProfiles = async () => {
  const res = await api.get(`${BASE}/profile/all`);
  return res.data;
};

export const createUser = async (user) => {
  const res = await api.post(`${BASE}/save`, user);
  return res.data;
};

export const updateUser = async (email, user) => {
  const res = await api.put(`${BASE}/update/${email}`, user);
  return res.data;
};

export const deleteUser = async (email) => {
  const res = await api.delete(`${BASE}/delete/${email}`);
  return res.data;
};