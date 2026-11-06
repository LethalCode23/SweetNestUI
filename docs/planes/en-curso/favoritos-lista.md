# Plan — "Mis favoritos": permiso RBAC + lista (frontend)

Plan madre del backend: `../../SweetNestApp/docs/planes/completados/favoritos.md`.
Plan anterior: [`../completados/favoritos-frontend.md`](../completados/favoritos-frontend.md).

## Estado

| Bloque | Estado | Contenido | Depende del backend |
|---|---|---|---|
| A | ✅ 2026-11-04 | Submódulo "Mis favoritos" en RBAC, rutas `/favoritos` y `/dashboard/favorites`, mejoras de la página y del navbar | `DataInitializer` ✅ |
| B | ⏳ | Revisión visual en el navegador (375 / 768 / 1280 px) | — |

Detalle de lo hecho → `docs/BITACORA.md`.

---

## Bloque A

- [x] Backend: `DataInitializer` siembra "Mis favoritos" (`/favorites`, acciones R y D) en "Mi Cuenta" para Administrador y Usuario
- [x] `MODULES.FAVORITES` + ícono `Heart` en el sidebar
- [x] `App.jsx`: `/favoritos` y `/dashboard/favorites` con `requiredSubModule`
- [x] `FavoritesPage`: `inPanel`, contador, estados vacío y error, paginación coherente al quitar
- [x] Navbar: enlace condicionado al permiso + accesos de la cuenta en el menú mobile
- [x] `npm run build` OK · `npm run lint` = 13

## Bloque B

- [ ] Sidebar → "Mis favoritos" (corazón) → `/dashboard/favorites`, título del header correcto
- [ ] Navbar (escritorio y mobile) → `/favoritos`
- [ ] 13+ favoritos → 2 páginas; quitar todos en la página 2 → vuelve a la 1
- [ ] Perfil sin el permiso → no ve el enlace y `/favoritos` redirige a `/dashboard`
- [ ] 375 / 768 / 1280 px en las dos rutas
