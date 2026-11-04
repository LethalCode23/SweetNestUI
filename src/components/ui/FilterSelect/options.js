/** Opciones del filtro de estado A/I, comunes a todos los catálogos. */
export const STATE_OPTIONS = [
  { value: "A", label: "Activos" },
  { value: "I", label: "Inactivos" },
];

/** Opciones únicas {value,label} a partir de las filas (para filtros por relación). */
export const optionsFrom = (rows, getValue, getLabel = getValue) => {
  const seen = new Map();
  rows.forEach((r) => {
    const value = getValue(r);
    if (value !== undefined && value !== null && value !== "" && !seen.has(String(value))) {
      seen.set(String(value), String(getLabel(r)));
    }
  });
  return [...seen].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, "es"));
};
