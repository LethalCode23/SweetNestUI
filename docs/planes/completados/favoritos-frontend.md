# Plan — Favoritos de hoteles (frontend)

Plan madre del backend: `../../SweetNestApp/docs/planes/completados/favoritos.md`.

## Estado

| Bloque | Estado | Contenido | Depende del backend |
|---|---|---|---|
| A | ✅ 2026-11-03 | Servicio, contexto, corazón en card y detalle, login y volver, página "Mis favoritos" | Fase 1 ✅ |

Detalle de lo hecho → `docs/BITACORA.md`.

---

## Bloque A

- [x] `services/favoriteServices/favoriteService.js` (`getFavorites`, `getFavoriteIds`, `addFavorite`, `removeFavorite`)
- [x] `context/FavoritesContext.jsx`: ids en un `Set` atado al `user`; cambio inmediato con reversión si falla
- [x] `hooks/useFavoriteToggle.js`: sin sesión → `/login` con `state.from`
- [x] `LoginPage` vuelve a `state.from`; `ProtectedRoute` lo pasa al redirigir
- [x] `HotelCard`: 🔖 → `<Heart>` (rojo y relleno si es favorito, `stopPropagation`)
- [x] `HotelDetailPage`: botón "Guardar" ↔ "Guardado"
- [x] `pages/FavoritesPage.jsx` en `/favoritos` (`ProtectedRoute`) + enlace "Mis favoritos" en el menú del perfil
- [x] `npm run build` OK · `npm run lint` = 13 (sin subir)
- [ ] Revisión visual en el navegador → pasa a `en-curso/favoritos-lista.md`
