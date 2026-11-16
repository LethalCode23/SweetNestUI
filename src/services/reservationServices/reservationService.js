import api from "../api";

// Controlador: ReservationController (ApiResponse → los datos están en .data).
// El usuario sale del token: nunca se manda en el body.
// Errores: 409/1011 unidad ocupada · 400/1013 huéspedes > capacidad · 400/1014 rango inválido · 400/1015 fecha pasada.
export const createReservation = async ({ unitId, checkIn, checkOut, guests }) => {
  const res = await api.post(`/reservations`, { unitId, checkIn, checkOut, guests });
  // { resSec, unitId, unitName, hotSec, hotName, checkIn, checkOut, nights, guests,
  //   pricePerNight, totalPrice, status: "CONFIRMED" | "PENDING", createdAt }
  return res.data.data;
};
