const BASE = "http://localhost:8080/hotel";

export const getAll = async (page, size) => {
  const res = await fetch(`${BASE}/all?page=${page}&size=${size}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const createHotel = async (payload) => {
  const res = await fetch(`${BASE}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const updateHotel = async (payload) => createHotel(payload);

export const deleteHotel = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
};