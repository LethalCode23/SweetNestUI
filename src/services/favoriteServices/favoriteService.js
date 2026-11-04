import { Environment } from "../../Environments/Environment";
import api from "../api";

// Favoritos del usuario del token (todo exige sesión). Respuestas en ApiResponse → .data
const BASE = Environment.API_URL + "/favorites";

/** Página de favoritos: { content: [{ favSec, createdAt, hotel }], totalPages, ... } */
export const getFavorites = async (page = 0, size = 12) => {
  const res = await api.get(BASE, { params: { page, size } });
  return res.data?.data ?? res.data;
};

/** Solo los hotSec guardados, para pintar los corazones. */
export const getFavoriteIds = async () => {
  const res = await api.get(`${BASE}/ids`);
  return res.data?.data ?? res.data;
};

/** Idempotente: guardar dos veces deja un solo favorito. */
export const addFavorite = async (hotSec) => {
  const res = await api.put(`${BASE}/${hotSec}`);
  return res.data?.data ?? res.data;
};

/** Idempotente: quitar algo que no estaba responde 200. */
export const removeFavorite = async (hotSec) => {
  await api.delete(`${BASE}/${hotSec}`);
};
