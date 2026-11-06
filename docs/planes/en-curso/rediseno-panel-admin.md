# Rediseño del panel admin (claro, con sidebar navy)

Pasar el panel `/dashboard` al sistema de diseño de [`DESIGN.md`](../../../DESIGN.md):
sidebar navy, hoja clara, color solo para estados y para la acción principal.

## Estado

| Fase | Estado | Contenido |
|---|---|---|
| 1 | ✅ 2026-10-31 | `DESIGN.md`, `tokens.css`, `admin-kit.css`, Manrope; shell (sidebar + header) rediseñado |
| 2 | ✅ 2026-10-31 | Componentes `ui/` (DataTable, IconButton, ConfirmDialog, StatusBadge) + Tipos de alojamiento |
| 3 | ✅ 2026-10-31 | `DataTable` en Países, Departamentos, Ciudades, Categorías, Características, Usuarios y Hoteles (+ `useConfirmDelete`, `FilterSelect`) |
| 4 | ✅ 2026-10-31 | Pulido: `FormDrawer` + primitivos de form en los 8 catálogos, responsive, hover y animaciones; limpieza de CSS viejo |
| 5 | ⬜ | Perfiles, Permisos, Mi perfil; retirar `.dark`, `--shell-*` y `docs/ui-palette.md` |

Detalle de cada fase → `docs/BITACORA.md`.

---

## Fase 1 — Sistema + shell

- [x] Tokens `--sn-*` en `src/styles/tokens.css`
- [x] Kit `sn-btn*` / `sn-badge*` en `src/styles/admin-kit.css`
- [x] Manrope en `index.html`
- [x] Sidebar navy: grupos, ítem activo, colapsable persistente, cuenta con popover
- [x] Header con título derivado de la ruta + slot de acciones
- [x] Off-canvas en < 900px

## Fase 2 — Componentes + Tipos

- [x] `src/components/ui/`: `DataTable`, `IconButton` (tooltip propio), `ConfirmDialog` (`<dialog>` nativo), `StatusBadge`
- [x] Tipos de alojamiento (`TypesHotel/`). Se borró `HotelTypeCard`

Decisiones:
- El modal de confirmación usa `<dialog>` nativo (sin dependencias nuevas; foco atrapado y Esc de serie).
- El botón principal vive en la toolbar del `DataTable` (como en la referencia), no en el header.
  El slot `headerActions` queda para acciones globales de la página, si alguna vez aparecen.

## Fase 3 — Catálogos con DataTable

- [x] Piezas compartidas: `useConfirmDelete`, `FilterSelect` + `sn-select`, `ui/catalog.module.css`, `Utils/apiError.js`
- [x] Países · Departamentos · Ciudades · Categorías · Características · Usuarios · Hoteles
- [x] Se borraron las tarjetas o tablas viejas (`*Card.jsx`, `HotelTable.jsx`) y sus CSS
- [ ] Revisión visual en el navegador de las 8 pantallas (en la sesión no estaba disponible la extensión de Chrome)

Decisiones:
- Hoteles en **modo local** con `getHotels(0, 1000)`: `/hotel/all` no filtra por nombre, así que con paginación
  de servidor la búsqueda solo vería la página actual. Revisar si el catálogo pasa de unos cientos.
- Se quitaron los chips y tarjetas de estadísticas de Usuarios y Hoteles. Los de Usuarios eran engañosos
  ("Admins" = `proId === 1`; "Activos" = estado del perfil).

## Fase 4 — Pulido (forms, responsive, interacción)

- [x] `FormDrawer` (`<dialog>`, envío con banner de error, cierre animado) + primitivos `Field`, `FieldRow`, `FormSection`, `Switch`, `SegmentedControl`, `ChipGroup`
- [x] Los 8 forms (País, Categoría, Tipo, Característica, Departamento, Ciudad, Usuario, Hotel) en el drawer, con validación inline sin `alert()`
- [x] **Bug:** `FeatureForm` ahora envía y lee `feaEst` (antes el estado nunca se guardaba)
- [x] **Bug:** `HotelForm` envía `typeId` (antes crear un hotel siempre daba `404/1008`)
- [x] Responsive: drawer a pantalla completa < 600px, columna de acciones sticky, filtros al 50%
- [x] Interacción: press en botones, hover de fila, acciones discretas hasta pasar el mouse, transiciones en campos
- [x] Limpieza: `CountryComponent.css`, `DepartmentForm.module.css`, `CityForm.module.css`, `FeatureForm.css`, `UserForm.module.css`; `drawer-*`, `form-section*`, `.btn-*` de `globals.css`
- [ ] Revisión visual en el navegador (en la sesión no estaba disponible la extensión de Chrome)

Deudas detectadas en esta fase → [`DEUDA_TECNICA.md`](../../DEUDA_TECNICA.md): DT-001 (500 al crear un hotel con
características; workaround activo), DT-003 (borrar imágenes guardadas), DT-004 (prioridad de imágenes nuevas).

## Fase 5 — Páginas restantes y retiro del tema viejo

- [ ] Perfiles · Permisos · Mi perfil
- [ ] Borrar `.dark` y `--shell-*` de `App.css`; archivar `docs/ui-palette.md`
- [ ] Código muerto: `Hotel/HotelAdminCard.jsx` (+ `.css`), `HotelsCrudList.css` (DT-013)
- [ ] Mover este plan a `completados/`
