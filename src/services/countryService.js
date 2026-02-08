const BASE = "http://localhost:8080/country";

export const getAll = async () => {
  const res = await fetch(`${BASE}/all`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const createCountry = async (payload) => {

  const res = await fetch(`${BASE}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const updateCountry = async (payload) => {
  return createCountry(payload);
};

export const deleteCountry = async (id) => {

  const res = await fetch(`${BASE}/delete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res.text();
};
