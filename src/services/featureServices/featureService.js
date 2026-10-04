import { Environment } from "../../Environments/Environment";
import api from "../api";

const BASE = Environment.API_URL + '/feature';

/**
 * Obtiene todas las características (Features)
 */
export const getAllFeatures = async () => {
  const res = await api.get(`${BASE}/all`);
  return res.data?.data ?? res.data;
};

/**
 * Obtiene una característica por su ID
 */
export const getFeatureById = async (id) => {
  const res = await api.get(`${BASE}/${id}`);
  return res.data?.data ?? res.data;
};

/**
 * Crea una nueva característica
 */
export const createFeature = async (featureDto) => {
  const res = await api.post(`${BASE}`, featureDto);
  return res.data?.data ?? res.data;
};

/**
 * Actualiza una característica existente
 */
export const updateFeature = async (id, featureDto) => {
  const res = await api.put(`${BASE}/${id}`, featureDto);
  return res.data?.data ?? res.data;
};

/**
 * Elimina una característica por ID
 */
export const deleteFeature = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data?.data ?? res.data;
};
