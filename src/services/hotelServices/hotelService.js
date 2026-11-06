import { Environment } from "../../Environments/Environment";
import axios from "axios";
import api from "../api";

const BASE = Environment.API_URL + '/hotel';
const BASE_IMGS = Environment.API_URL + '/hotel-images';

export const getAll = async (page, size, citName) => {

  const res = await api.get(
    `${BASE}/findByHotel?page=${page}&size=${size}${citName ? `&citName=${citName}` : ''}`
  );

  return res.data;
};

export const findByHotel = async (page, size, filters = {}) => { // 👈 este es el nuevo método que acepta filtros, mirar getAll to this

  const { citName, minCost, maxCost, categoryIds, startDate, endDate } = filters;

  const params = new URLSearchParams();
  params.append('page', page);
  params.append('size', size);

  if (citName) params.append('citName', citName);
  if (minCost != null) params.append('minCost', minCost);
  if (maxCost != null) params.append('maxCost', maxCost);
  if (startDate) params.append('checkIn', startDate);
  if (endDate) params.append('checkOut', endDate);

  if (categoryIds?.length) {
    categoryIds.forEach(id => params.append('categoryIds', id));
  }

  const res = await api.get(`${BASE}/findByHotel?${params.toString()}`);
  return res.data;
};

export const findDetailById = async (hotSec) => { // metodo ayuda a consumir el detalle del hotel

  const res = await api.get(`${BASE}/findDetailById/${hotSec}`);
  return res.data;
}

// Autocompletado del buscador (público). Devuelve [{ type: "CITY" | "HOTEL", id, name }] crudo,
// sin ApiResponse (contrato de SearchSuggestionDto). `signal` permite cancelar con AbortController.
export const getSearchSuggestions = async (q, { signal } = {}) => {
  const res = await api.get(`${BASE}/suggestions`, { params: { q }, signal });
  return Array.isArray(res.data) ? res.data : [];
};

// Fechas sin ninguna unidad libre (público, viene en ApiResponse). Ver docs/calendario-fechas-ocupadas.md.
// Usa axios directo y no `api`: el interceptor mandaría un token vencido del localStorage y el
// backend respondería error aunque el endpoint sea público (DT-036).
// Devuelve { hotSec, from, to, totalUnits, unavailableDates: ["YYYY-MM-DD", ...] }.
export const getUnavailableDates = async (hotSec, { from, to, signal } = {}) => {
  const res = await axios.get(`${BASE}/${hotSec}/unavailable-dates`, {
    params: { from, to }, // undefined se omite
    signal,
  });
  return res.data.data;
};

// CRUD del panel. /hotel/all pagina en el servidor (por defecto 10): el admin pide
// un size grande para listar todo y buscar/filtrar en el cliente.
export const getHotels = async (page = 0, size = 10) => {

  const res = await api.get(`${BASE}/all`, { params: { page, size } });
  return res.data;
}

export const createHotel = async (payload) => {

  const res = await api.post(`${BASE}/save`, payload);
  return res.data;
};

export const updateHotel = async (hotSec, payload) => {
  console.log("Payload", payload);
  const res = await api.put(`${BASE}/update/${hotSec}`, payload);
  return res.data;
}

export const deleteHotel = async (id) => {

  const res = await api.delete(`${BASE}/delete/${id}`);
  return res.data;
};

export const uploadHotelImage = async (hotSec, hotImgPri, file) => {

  const formData = new FormData();
  console.log("Uploading image for hotel", hotSec, "with priority", hotImgPri, "and file", file);

  formData.append("hotSec", hotSec);
  formData.append("hotImgPri", hotImgPri);
  formData.append("file", file);

  const res = await api.post(`${BASE_IMGS}/save`, formData);
  return res.data;
};