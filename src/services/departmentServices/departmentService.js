import { Environment } from "../../Environments/Environment";
import api from "../api";

const BASE = Environment.API_URL + '/department';

export const getAll = async () => {
  const res = await api.get(`${BASE}/all`);
  return res.data;
};

export const createDepartment = async (payload) => {
  const res = await api.post(`${BASE}/save`, payload);
  return res.data;
};

export const updateDepartment = async (payload) => {
  // If backend uses same save for create/update
  return createDepartment(payload);
};

export const deleteDepartment = async (id) => {
  const res = await api.delete(`${BASE}/delete/${id}`);
  return res.data;
};