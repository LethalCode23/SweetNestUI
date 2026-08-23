import { Environment } from "../../Environments/Environment";
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

  const { citName, minCost, maxCost, categoryIds } = filters;

  const params = new URLSearchParams();
  params.append('page', page);
  params.append('size', size);

  if (citName) params.append('citName', citName);
  if (minCost != null) params.append('minCost', minCost);
  if (maxCost != null) params.append('maxCost', maxCost);
  if (categoryIds?.length) {
    categoryIds.forEach(id => params.append('categoryIds', id));
  }

  const res = await api.get(`${BASE}/findByHotel?${params.toString()}`);
  return res.data;
};

export const getHotels = async () => { /* este lo uso para crud */
  
  const res = await api.get(`${BASE}/all`);
  return res.data;
}

export const createHotel = async (payload) => {

  const res = await api.post(`${BASE}/save`, payload);
  return res.data;
};

export const updateHotel = async (hotSec, payload) => {

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