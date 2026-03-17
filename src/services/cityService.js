const BASE = "http://localhost:8080/city";

export const getCities = async () => {
  const res = await fetch(`${BASE}/all`);
  return res.json();
};

export const createCity = async (city) => {

    console.log('Creando ciudad:', city);
  const res = await fetch(`${BASE}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(city),
  });

  console.log('Respuesta del servidor:', res);
  return res.json();
};

export const updateCity = async (id, city) => {
  const res = await fetch(`${BASE}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(city),
  });
  return res.json();
};

export const deleteCity = async (id) => {
  await fetch(`${BASE}/delete/${id}`, { method: "DELETE" });
};