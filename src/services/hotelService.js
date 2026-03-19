const BASE = "http://localhost:8080/api/hotel";

export const getAll = async (page, size, citName) => {

  const res = await fetch(`${BASE}/findByHotel?page=${page}&size=${size}${citName ? `&citName=${citName}` : ''}`);
  
  console.log('Respuesta del servidor:', citName);
  console.log('Respuesta del servidor:', res);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getHotels = async () => { /* este lo uso para crud */
  const res = await fetch(`${BASE}/all`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const createHotel = async (payload) => {

  console.log('Enviando payload al servidor:', payload);
  const res = await fetch(`${BASE}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  console.log('Respuesta del servidor:', res);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const updateHotel = async (hotSec, payload) => {

  // console.log('Enviando payload (update) al servidor:', payload);

  const res = await fetch(`${BASE}/update/${hotSec}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // console.log('Respuesta del servidor (update):', res);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export const deleteHotel = async (id) => {
  const res = await fetch(`${BASE}/delete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
};