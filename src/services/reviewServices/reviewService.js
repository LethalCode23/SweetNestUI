import { Environment } from "../../Environments/Environment";
import api from "../api";

// HU #28 — Valoraciones. Respuestas en ApiResponse → .data
// El listado es público; /mine y guardar exigen sesión (el usuario sale del token).
const BASE = Environment.API_URL + "/reviews/hotel";

/** { ratingAvg, ratingCount, distribution: [5★..1★], reviews: Page<{ revSec, stars, comment, userName, date }> } */
export const getHotelReviews = async (hotSec, page = 0, size = 5) => {
  const res = await api.get(`${BASE}/${hotSec}`, { params: { page, size } });
  return res.data?.data ?? res.data;
};

/** { canReview, review | null } del usuario del token. */
export const getMyReview = async (hotSec) => {
  const res = await api.get(`${BASE}/${hotSec}/mine`);
  return res.data?.data ?? res.data;
};

/** Crea o actualiza (una por usuario y hotel). Devuelve el resumen ya recalculado (primera página). */
export const saveReview = async (hotSec, { stars, comment }) => {
  const res = await api.put(`${BASE}/${hotSec}`, { stars, comment });
  return res.data?.data ?? res.data;
};
