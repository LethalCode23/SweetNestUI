# Plan — HU #26: Políticas del producto (frontend)

Plan madre del backend: `../../SweetNestApp/docs/planes/en-curso/politicas-producto.md`.

## Estado

| Bloque | Estado | Contenido | Depende del backend |
|---|---|---|---|
| A | ✅ 2026-11-12 | Bloque "Políticas del alojamiento" en el detalle | Fase 1 ✅ |
| B | ✅ 2026-11-12 | Editor de políticas en `HotelForm` | Fase 2 ✅ |
| C | ⏳ | Revisión visual en el navegador (commit ya hecho: `f86ec80`) | — |

Detalle de lo hecho → `docs/BITACORA.md` (2026-11-12).

---

## Bloque A

- [x] `components/HotelDetail/HotelPolicies.jsx` (+ CSS) debajo del layout de dos columnas, ancho completo
- [x] Grilla 1 / 2 / 3 columnas (móvil / ≥640px / ≥1024px)
- [x] Datos de `hotel.policies`; si vienen vacías, fallback `listing.policies`
- [x] Se quitó "Normas y Políticas del Hotel" de `ListingContent` y `listing.rules`

## Bloque B

- [x] `components/Hotel/PolicyEditor.jsx` (+ CSS) y `policyItems.js`, sección entre "Categorías y características" e "Imágenes"
- [x] Cards con orden, título, descripción con contador, subir / bajar / quitar
- [x] Vacío: "Usar políticas sugeridas" o "Escribir una desde cero"
- [x] El payload siempre manda `policies` completo; errores por política en su card
- [x] `npm run build` OK · `npm run lint` = 13

## Bloque C

- [ ] `/hoteles/1`: bloque de políticas a 375 / 768 / 1280 px
- [ ] Panel → editar hotel: agregar, reordenar, quitar y guardar; el detalle refleja el cambio
- [ ] Título vacío → error en su card y no se guarda
- [ ] Commit (`feat: politicas del producto en detalle y panel (HU #26)`)
