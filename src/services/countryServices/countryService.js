import { Environment } from "../../Environments/Environment";
import api from "../api";

const BASE = Environment.API_URL + '/country';

export const getAll = async () => {

  const res = await api.get(`${BASE}/all`);
  return res.data;
};

export const createCountry = async (payload) => {
  
  const res = await api.post(`${BASE}/save`, payload); 
  return res.data;
};

export const updateCountry = async (payload) => {
  return createCountry(payload);
};

export const deleteCountry = async (id) => {

  const res = await api.delete(`${BASE}/delete/${id}`);
  return res.data;
};