# CLAUDE.md — SweetNest (frontend)

Arquitectura y reglas **estables** del cliente. **Mantener corto y vigente.**
- El estado de lo que se está construyendo va en los planes (`docs/planes/`), no acá.
- El registro cronológico de lo que se hace va en `docs/BITACORA.md`.
- `AGENTS.md` solo apunta a este archivo; no duplicar contenido.

## Qué es

SPA de alojamientos (DH - Proyecto Final). React 19 · Vite 7 (SWC) · react-router-dom 6
(`createBrowserRouter`) · MUI 7 + lucide-react · axios · react-hook-form + yup.

- **Backend aparte:** `../../SweetNestApp` (Spring Boot, puerto 8080, base `/api`).
  Su `API.md` es la **fuente de verdad** de los endpoints; su `CLAUDE.md` tiene las reglas de negocio.

## Comandos

```bash
npm run dev      # Vite en http://localhost:5173 (el CORS del backend apunta acá)
npm run build
npm run lint
```
Verificación de cualquier cambio = `npm run build` + `npm run lint`.
Baseline de lint: **13 problemas preexistentes** (2026-10-31); no subir ese número.
Catálogos del panel: seguir la "Receta de una página de catálogo" de `DESIGN.md` (`DataTable` + `useConfirmDelete`
+ `FormDrawer` para crear/editar).

## Arquitectura y convenciones (seguir el estilo existente, no inventar otro)

Detalle (mapa de rutas, tabla de services, RBAC) en `docs/ARQUITECTURA.md`; acá solo las reglas.

- **Capas:** `pages/` → `components/<Modulo>/` → `services/<modulo>Services/*Service.js`
  → `services/api.js` (axios + interceptor `Bearer` desde `localStorage.token`)
  → `Environments/Environment.js` (`API_URL`, `API_URL_IMG`). Nunca llamar a axios directo desde un componente.
- **Rutas:** solo en `src/App.jsx`. Lo público cuelga del `Layout` (Navbar + Footer);
  el panel cuelga de `/dashboard` y cada página va envuelta en
  `<ProtectedRoute requiredSubModule="...">`. Ruta nueva → actualizar la tabla de `docs/ARQUITECTURA.md`.
- **Permisos (RBAC):** nombres de submódulo en `src/constants/modules.js` (`MODULES`, `ACTIONS` `R/C/U/D`);
  **deben coincidir textualmente con el backend**. Mostrar/ocultar con
  `hasSubmodulePermission` / `hasActionPermission` de `context/AuthContext.jsx`. Iconos del sidebar en `constants/moduleIcons.js`.
- **Formato de respuesta (consistencia parcial a propósito, viene del backend):**
  endpoints viejos (`hotel`, `category`, `city`…) devuelven DTO o `Page` crudos;
  los nuevos (`hotel-types`, `hotel-unit`, `reservations`) vienen en `ApiResponse` → los datos están en `.data`.
  **No asumir un formato único**; desenvolver en el service o con un helper (ver `unwrapList` en `TypesHotel/HotelTypeComponent.jsx`).
- **Errores de negocio:** el backend manda `code` numérico (`1008`–`1020`) + HTTP; mostrar `err.response?.data?.message`.
- **Banderas:** `'S'/'N'` y estados `'A'/'I'` viajan como **string** (igual que en el backend).
- **Estilos:** CSS Modules con nombre **PascalCase igual al componente**.
  Panel admin → **[`DESIGN.md`](DESIGN.md)** es la fuente de verdad: tokens `var(--sn-*)` (`src/styles/tokens.css`),
  botones `sn-btn*` y badges `sn-badge*` (`src/styles/admin-kit.css`), Manrope. Leerlo antes de tocar UI del panel.
  `docs/ui-palette.md` + `.dark`/`--shell-*` = tema oscuro **viejo**, solo para Perfiles, Permisos y Mi perfil.
- **Formularios:** react-hook-form + yup (`@hookform/resolvers`).

## Reglas ya decididas (no volver a preguntar)

Vienen del backend; acá solo las que impactan al cliente.
1. Búsqueda y detalle de hotel son **públicos**; reservar exige sesión (sin sesión → login y volver).
2. Lo que se reserva es la **unidad** (`hotel_units`), nunca el hotel.
3. El usuario sale del **token**; nunca mandar `userId` en el body de una reserva.
4. Crear hotel exige `typeId` (si falta → `404/1008`); el selector se llena con `GET /api/hotel-types/actives`.
   `hotConfirmReq` (`'S'/'N'`) es opcional; `'N'` → la reserva nace `CONFIRMED`, `'S'` → `PENDING`.
5. Confirmar reserva: admin o anfitrión del hotel. Cancelar: dueño de la reserva o admin.
6. Rutas del backend en singular (`/api/hotel/...`); no asumir plural.  (Excepción ya existente: `/api/reservations`, `/api/favorites`.)
7. Favoritos exigen sesión: sin `user`, el corazón manda a `/login` con `state.from` y el login vuelve ahí.
   Estado global en `context/FavoritesContext.jsx`; botones con `hooks/useFavoriteToggle.js`.

## Trampas del entorno

- **Rename solo de mayúsculas en Windows** (`core.ignorecase=true`): `git add` no registra el rename.
  Usar `git rm --cached <viejo>` + `git add <nuevo>`. Detalle en `docs/session-2026-10-04.md`.

## Flujo de planes

```
docs/planes/
  pendientes/    # planes aprobados que todavía no se empezaron
  en-curso/      # lo que se está implementando (idealmente uno solo)
  completados/   # cerrados; no se editan más
```
- Plan nuevo → `docs/planes/pendientes/<tema>.md` (nombre corto en kebab-case).
- Al empezar a implementarlo → `git mv` a `en-curso/`. Al cerrar la última fase → `completados/`.
- Cada plan lleva arriba un bloque **Estado** por fase (✅ hecho / ⏳ siguiente / ⬜ pendiente).
- Al cerrar una fase: actualizar el bloque Estado del plan + agregar una entrada en `docs/BITACORA.md`.
- Si se decide una regla nueva que va a durar, se suma a "Reglas ya decididas" de este archivo.
- Si el plan depende del backend, linkear el plan madre de `../../SweetNestApp/docs/planes/`.
- **Bugs, atajos y pendientes → `docs/DEUDA_TECNICA.md`.** Si encuentras uno, agrega una fila en "Abiertas" (`DT-xxx`).
  Cuando se resuelve, la fila pasa a "Resueltas" con fecha y referencia; nunca se borra. Un workaround en el código cita
  su ID. La bitácora cuenta la historia; la deuda dice el estado.

**Planes activos:** `docs/planes/en-curso/reservas-frontend.md` · `docs/planes/en-curso/rediseno-panel-admin.md`.

## Docs

- `DESIGN.md`: sistema de diseño del panel (paleta, tipo, espaciado, botones, badges, layout)
- `docs/ARQUITECTURA.md`: capas, rutas, JWT, RBAC, services · `docs/ui-palette.md`: tema oscuro viejo (en retiro)
- `docs/BITACORA.md`: registro cronológico · `docs/planes/`: planes por estado (ver arriba)
- `docs/DEUDA_TECNICA.md`: bugs y pendientes, abiertos y resueltos
