import { Environment } from "../../Environments/Environment";
import api from "../api";

const BASE = Environment.API_URL + '/city';

export const getCities = async () => {

  const res = await api.get(`${BASE}/all`);
  return res.data;
};

export const createCity = async (city) => {

  const res = await api.post(`${BASE}/save`, city);
  return res.data;
};

export const updateCity = async (id, city) => {

  const res = await api.put(`${BASE}/update/${id}`, city);
  return res.data;
};

export const deleteCity = async (id) => {
  
  const res = await api.delete(`${BASE}/delete/${id}`);
  return res.data;
};