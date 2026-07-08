import { Environment } from "../../Environments/Environment";
import api from "../api";

const BASE = Environment.API_URL + '/category';

export const getAll = async () => {
  const res = await api.get(`${BASE}/all`);
  return res.data;
};

export const createCategory = async (payload) => {
  const res = await api.post(`${BASE}/save`, payload);
  return res.data;
};

export const updateCategory = async (payload) => {
  return createCategory(payload);
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`${BASE}/delete/${id}`);
  return res.data;
};