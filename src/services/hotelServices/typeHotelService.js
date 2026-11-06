import { Environment } from "../../Environments/Environment";
import api from "../api";

const BASE = Environment.API_URL + '/hotel-types';

// Lista todos (publico)
export const getAll = async () => {
    const res = await api.get(BASE);
    return res.data;
};

// Solo typState = 'A', ordenados por nombre (publico). Ideal para selects y filtros
export const getActives = async () => {
    const res = await api.get(`${BASE}/actives`);
    return res.data;
};

export const findById = async (typSec) => {
    const res = await api.get(`${BASE}/${typSec}`);
    return res.data;
};

// Solo Administrador. payload: { typName, typMultiUnit: 'S' | 'N', typState?: 'A' | 'I' }
export const createHotelType = async (payload) => {
    const res = await api.post(BASE, payload);
    return res.data;
};

// typName y typMultiUnit son obligatorios; typState null no cambia el estado
export const updateHotelType = async (typSec, payload) => {
    const res = await api.put(`${BASE}/${typSec}`, payload);
    return res.data;
};

// Devuelve 409 (codigo 1017) si el tipo tiene hoteles asociados
export const deleteHotelType = async (typSec) => {
    const res = await api.delete(`${BASE}/${typSec}`);
    return res.data;
};