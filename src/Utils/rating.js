// HU #28 — Formato de valoraciones, compartido por el detalle, el BookingCard y las cards de búsqueda.

const oneDecimal = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** 4.6 → "4,6" */
export const formatRating = (avg) => oneDecimal.format(Number(avg) || 0);

/** 1 → "1 valoración", 12 → "12 valoraciones" */
export const ratingCountLabel = (count) => `${count} ${count === 1 ? "valoración" : "valoraciones"}`;

/** Fecha de publicación de una reseña: "3 nov 2026" */
export const formatReviewDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" }).replace(".", "")
    : "";

/** Texto de cada puntuación del selector de estrellas. */
export const STAR_LABELS = ["Muy malo", "Malo", "Regular", "Bueno", "Excelente"];
