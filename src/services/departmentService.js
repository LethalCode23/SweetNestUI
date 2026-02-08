const BASE = "http://localhost:8080/department";

export const getAll = async () => {
  const res = await fetch(`${BASE}/all`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const createDepartment = async (payload) => {
  const res = await fetch(`${BASE}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const updateDepartment = async (payload) => {
  // If backend uses same save for create/update
  return createDepartment(payload);
};

export const deleteDepartment = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
};