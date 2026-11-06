# Calendario: fechas ocupadas del hotel

Endpoint **público** (sin login) que devuelve los días en que un hotel no tiene ninguna
unidad libre, para deshabilitarlos en el calendario del detalle / reserva.

## Endpoint

```
GET {API_URL}/hotel/{hotSec}/unavailable-dates?from=YYYY-MM-DD&to=YYYY-MM-DD
```

| Param | Obligatorio | Default | Nota |
|---|---|---|---|
| `hotSec` (path) | sí | — | id del hotel |
| `from` | no | hoy | inclusivo |
| `to` | no | `from` + 6 meses | **exclusivo**; rango máx. 366 días |

## Respuesta (`ApiResponse`)

```json
{
  "success": true,
  "message": "Fechas no disponibles obtenidas",
  "code": 0,
  "data": {
    "hotSec": 5,
    "from": "2026-11-01",
    "to": "2027-05-01",
    "totalUnits": 1,
    "unavailableDates": ["2026-11-11", "2026-11-12", "2026-11-13"]
  }
}
```

- `unavailableDates`: días bloqueados, ordenados, formato ISO. Ya viene calculado:
  - cuentan reservas `PENDING` y `CONFIRMED`;
  - en hoteles con varias unidades, un día solo aparece si **todas** están ocupadas;
  - el día de salida de una reserva **no** aparece (se puede entrar ese día).
- `totalUnits: 0` → el hotel no tiene unidades activas (no se puede reservar).
- Errores: `404` hotel inexistente · `400` si `to <= from` o rango > 366 días.

## Servicio (agregar en `src/services/hotelServices/hotelService.js`)

> ⚠️ Usar `axios` directo, **no** `api`: el interceptor de `api.js` manda el token del
> `localStorage`, y si está vencido el backend responde error aunque el endpoint sea público.

```js
import axios from "axios";

// Público. Devuelve { hotSec, from, to, totalUnits, unavailableDates: ["YYYY-MM-DD", ...] }
export const getUnavailableDates = async (hotSec, { from, to } = {}) => {
  const res = await axios.get(`${BASE}/${hotSec}/unavailable-dates`, {
    params: { from, to }, // undefined se omite
  });
  return res.data.data;
};
```

## Uso en el calendario

Convertir los strings a fechas **locales** (no `new Date("2026-11-11")`, que se interpreta
en UTC y en Colombia/México corre el día):

```js
const toLocalDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const { unavailableDates } = await getUnavailableDates(hotSec);
const blocked = new Set(unavailableDates); // comparar por string es lo más simple
```

- **react-datepicker:** `excludeDates={unavailableDates.map(toLocalDate)}`
- **MUI `@mui/x-date-pickers`:** `shouldDisableDate={(day) => blocked.has(day.format("YYYY-MM-DD"))}` (dayjs)

## Reglas para el rango elegido

- Un rango `checkIn → checkOut` es válido si **ninguna noche** cae en `blocked`: revisar
  desde `checkIn` hasta el día **anterior** a `checkOut`. El `checkOut` sí puede ser un día
  bloqueado (ese día otra persona entra; el huésped ya sale).
- Para cargar menos datos, se puede pedir solo lo visible: al cambiar de mes, llamar con
  `from` = 1.º del mes visible y `to` = 1.º de dos meses después.
- Es una guía visual, no una garantía: en hoteles con varias unidades puede que cada noche
  tenga *alguna* unidad libre pero no la *misma* todas las noches. La validación definitiva
  de cruce al crear la reserva es la Fase 2 · Bloque B del backend (todavía pendiente).

## Probar

```bash
curl "http://localhost:8080/api/hotel/1/unavailable-dates"
```
Los hoteles seed tienen reservas a pocos días de hoy (p. ej. "Hotel Poblado Suite",
"Costa Caribe Barranquilla").
