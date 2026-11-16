# Plan — HU #28: Puntuar producto (frontend)

Plan madre del backend: `../../SweetNestApp/docs/planes/en-curso/resenas.md`.

## Estado

| Bloque | Estado | Contenido | Depende del backend |
|---|---|---|---|
| A | ✅ 2026-11-12 | Servicio, estrellas, sección `#resenas`, promedio real en encabezado, cards y BookingCard | Fase 1 ✅ |
| B | ⏳ | Revisión visual en el navegador + commit | — |

Detalle de lo hecho → `docs/BITACORA.md` (2026-11-12).

---

## Bloque A

- [x] `services/reviewServices/reviewService.js` + `Utils/rating.js` (formato "4,6", "12 valoraciones", fechas)
- [x] `components/HotelDetail/Reviews/`: `StarRating`, `StarInput` (radiogroup con flechas), `HotelReviews`
- [x] Sección `#resenas` entre el layout y Políticas; el rating del encabezado enlaza a ella
- [x] El formulario cambia según el caso: sin sesión → login (vuelve al hotel) · sin estadía terminada → aviso · puede valorar → publicar / actualizar
- [x] Al guardar se actualizan resumen, lista, encabezado y BookingCard; la reseña propia se resalta
- [x] `HotelCard` y `BookingCard` sin valores fijos (4.7 / 4.89 · 119)
- [x] `npm run build` OK · `npm run lint` = 13

## Bloque B

- [ ] Sin sesión → "Iniciar sesión" y vuelve al hotel
- [ ] `viajera@` en Poblado: ve su reseña precargada y la actualiza; el promedio cambia en detalle y card
- [ ] Usuario sin estadía → mensaje "Podrás valorar…"
- [ ] "Ver más reseñas", estado vacío, teclado en `StarInput`, 375 / 768 / 1280 px
- [ ] Calendario del detalle (`completados/calendario-fechas-ocupadas.md`): ocupados tachados y leyenda
- [ ] Commit (`feat: valoraciones y reseñas en el detalle (HU #28)`)
