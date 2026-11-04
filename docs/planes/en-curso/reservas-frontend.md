# Feature (frontend): búsqueda por disponibilidad y reservas

Fase 6 del plan madre del backend
(`../../SweetNestApp/docs/planes/en-curso/reservas.md` desde la raíz del repo, sección 6 — Fase 6), bajada al cliente.
Las reglas de negocio no se repiten acá: están en `CLAUDE.md` (de este repo y del backend).

## Estado

| Bloque | Estado | Contenido | Depende del backend |
|---|---|---|---|
| A | ⏳ en curso | CRUD de tipos de alojamiento + filtro de fechas en la búsqueda | Fase 1 ✅ |
| B | ⏳ | Formulario de hotel con `typeId` ✅, `hotConfirmReq` y `hostId` | Fase 1 ✅ · Fase 2A ✅ |
| C | ⬜ | Bloque de búsqueda del home | Fase 4 ⬜ |
| D | ⬜ | Detalle con unidades + reservar | Fase 2B ⬜ · Fase 5 ⬜ |
| E | ⬜ | Mis reservas, bandeja del anfitrión, confirmar / cancelar | Fase 1 ✅ · Fase 2A ✅ |

Detalle de lo hecho en cada bloque → `docs/BITACORA.md`.

---

## Bloque A — Tipos de alojamiento + fechas en la búsqueda

- [x] `typeHotelService.js` contra `/api/hotel-types` (desenvuelve `ApiResponse`)
- [x] Módulo `TypesHotel/` (listado, card, form) en `/dashboard/type-hotels`
- [x] `MODULES.HOTEL_TYPES` + icono en el sidebar
- [x] Filtro de rango de fechas en `HotelFilters` → `findByHotel` envía `checkIn`/`checkOut`
- [ ] Unificar el submódulo de la ruta (`"Hoteles"`) con el de las acciones (`"Tipos"`) según el backend (DT-005)
- [x] Manejar `409/1017` al borrar un tipo con hoteles (mensaje claro): `ConfirmDialog`, rediseño Fase 2
- [ ] `npm run build` + `npm run lint` sin subir el baseline
- [ ] Commit + entrada en la bitácora

## Bloque B — Formulario de hotel

- [x] Selector de tipo poblado con `getActives()`; `typeId` obligatorio al crear (2026-10-31, rediseño Fase 4)
- [ ] Toggle `hotConfirmReq` (`'S'` requiere confirmación / `'N'` inmediata)
- [ ] Selector de anfitrión (`hostId`) solo con usuarios `host='S'`; mostrar `409/1020`
- [ ] Editar hotel precarga `typeId`, `confirmReq` y `hostId` desde `findDetailById`
- [ ] Marca `host` editable en Usuarios solo para admin (`403/1018` si no)

## Bloque C — Búsqueda del home

- [ ] Bloque con título visible y párrafo descriptivo
- [x] Destino con autocompletado: `DestinationAutocomplete` en el home y en `/hoteles` (2026-10-31). El backend
      implementó `GET /api/hotel/suggestions?q=` (ciudades + hoteles, máx. 10), no `/cities/suggestions`
- [ ] Calendario doble para el rango de fechas (`@mui/x-date-pickers` + `dayjs` ya adoptados en el detalle, 2026-11-01)
- [ ] Botón "Realizar búsqueda" → resultados
- [ ] Al mostrar resultados se mantienen categorías y recomendaciones del home
- [ ] Funciona sin sesión (token vencido no debe romper la búsqueda)

## Bloque D — Detalle y reserva

- [x] Calendario del detalle bloquea fechas ocupadas (`GET /hotel/{id}/unavailable-dates`, 2026-11-01; límites en DT-037)
- [x] Fechas ocupadas distinguibles en el calendario: tachadas en rojo + leyenda (2026-11-01)
- [ ] Detalle lista unidades (todas sin fechas; libres si hay rango)
- [ ] Selección de unidad + huéspedes (no superar capacidad → `400/1013`)
- [ ] Pantalla de confirmar reserva (noches, precio, total que devuelve el backend)
- [ ] Sin sesión → login y regreso a la unidad elegida
- [ ] Mensajes para `1011` (no disponible), `1014` (rango inválido), `1015` (fecha pasada)

## Bloque E — Gestión de reservas

- [ ] "Mis reservas" (`GET /api/reservations/me?status=`) con cancelar (`PATCH /{id}/cancel`)
- [ ] Bandeja del anfitrión (`GET /api/reservations/incoming`) con confirmar
- [ ] Vista admin (`GET /api/reservations?status=`) con confirmar / cancelar
- [ ] Rutas + submódulos en `App.jsx` / `modules.js` y en `docs/ARQUITECTURA.md`

---

## Fuera de alcance

Igual que el plan madre: varias unidades por reserva, bloqueo manual de fechas, tarifas por
temporada, pagos, reseñas.
