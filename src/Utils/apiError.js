/** Mensaje legible de un error de axios: primero el del backend, si no el de la red/JS. */
export const apiErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Ocurrió un error inesperado.";

/** Lista desde una respuesta que puede venir cruda (array) o envuelta en ApiResponse (.data). */
export const unwrapList = (res) => (Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []);
