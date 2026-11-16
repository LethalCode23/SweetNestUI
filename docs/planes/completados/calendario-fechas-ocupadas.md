# Plan — Calendario del detalle con fechas ocupadas (frontend)

Contrato del endpoint: [`../../calendario-fechas-ocupadas.md`](../../calendario-fechas-ocupadas.md).
Backend: `GET /api/hotel/{hotSec}/unavailable-dates` (fase "Extra" de `../../SweetNestApp/docs/planes/en-curso/reservas.md`).

## Estado

| Bloque | Estado | Contenido |
|---|---|---|
| A | ✅ 2026-11-01 | `DatePicker` de MUI en `BookingCard` con días bloqueados |
| B | ✅ 2026-11-01 | Rediseño: ocupados tachados sobre rojo suave, rango en píldora, leyenda |

Detalle → `docs/BITACORA.md` (2026-11-01). La validación definitiva del cruce de fechas la hace el backend (DT-037).
La revisión visual se hace junto con la del detalle (`en-curso/resenas.md`, Bloque B).
