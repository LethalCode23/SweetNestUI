# Bitácora — SweetNestUI

Registro cronológico de lo que se crea y decide. **Agregar una entrada por sesión/fase,
no reescribir las anteriores.** Convenciones y reglas permanentes → `CLAUDE.md`.

---

## 2026-10-04 — Unificación visual del panel admin

**Rama:** `feat/unificacion-visual-admin` (mergeada en `main`, PR #1). Detalle completo en
[`session-2026-10-04.md`](./session-2026-10-04.md); acá solo el resumen.

- Perfiles y Usuarios migrados al tema oscuro del panel (21 colores en Perfiles); se arregló el
  rename `Profilespage.module.css` → `ProfilesPage.module.css` (trampa de `core.ignorecase`).
- El logo del sidebar pasó a ser un enlace al home.
- Se quitó el bloque de anfitrión y los highlights del detalle del hotel.
- Se documentó el estándar visual en [`ui-palette.md`](./ui-palette.md) y la arquitectura en
  [`ARQUITECTURA.md`](./ARQUITECTURA.md).

---

## 2026-10-31 — Estructura de docs + Fase 6 · Bloque A (en curso)

### Estructura de documentación

Se replicó el esquema del backend: `CLAUDE.md` (reglas estables), `AGENTS.md` (puntero),
esta bitácora y `docs/planes/{pendientes,en-curso,completados}/`. Plan activo:
[`planes/en-curso/reservas-frontend.md`](./planes/en-curso/reservas-frontend.md).
Los documentos de sesión (`session-AAAA-MM-DD.md`) se reemplazan por entradas acá.

### Bloque A — tipos de alojamiento + fechas en la búsqueda

**Rama:** `feature/product-search` (cambios staged, sin commit todavía).

| Archivo | Cambio |
|---|---|
| `services/hotelServices/typeHotelService.js` | Nuevo: `getAll`, `getActives`, `findById`, `create/update/deleteHotelType` contra `/api/hotel-types` |
| `components/TypesHotel/*` | Nuevo módulo: `HotelTypeComponent`, `HotelTypeCard`, `HotelTypeForm` + CSS Modules |
| `pages/HotelTypePage.jsx` + `App.jsx` | Ruta `/dashboard/type-hotels` |
| `constants/modules.js`, `constants/moduleIcons.js` | `MODULES.HOTEL_TYPES = "Tipos"` + icono `Shapes` |
| `components/Hotel/HotelFilters.jsx`, `pages/HotelSearchPage.jsx` | Filtro de rango de fechas |
| `services/hotelServices/hotelService.js` | `findByHotel` manda `checkIn` / `checkOut` |

### Pendientes detectados

- La ruta `type-hotels` usa `requiredSubModule="Hoteles"` pero los botones usan
  `MODULES.HOTEL_TYPES` (`"Tipos"`). Confirmar el nombre real del submódulo en el backend y unificar.
- El backend todavía **no filtra por disponibilidad** (Fase 4): `checkIn`/`checkOut` se envían pero se ignoran.

---

## 2026-10-31 — Rediseño del panel · Fase 1 (sistema de diseño + shell)

**Plan:** [`planes/en-curso/rediseno-panel-admin.md`](./planes/en-curso/rediseno-panel-admin.md) ·
**Sistema:** [`DESIGN.md`](../DESIGN.md).

### Decisiones

| # | Decisión |
|---|---|
| R1 | Sidebar **oscuro** (navy de marca `#0f1f35`, no negro) + contenido **claro**: pedido del usuario a partir de la referencia |
| R2 | Tipografía **Manrope**, una sola familia, cargada en `index.html` |
| R3 | Tokens nuevos con prefijo `--sn-*` para no pisar los de `App.css` (sitio público y páginas sin migrar) |
| R4 | Acción principal = azul de marca `#2b67f6` (la referencia usaba negro, y esta es la diferencia de identidad) |
| R5 | La cuenta del usuario pasa al pie del sidebar; se quitó el badge "En línea" porque siempre estaba en verde y no informaba nada |

### Cambios

| Archivo | Cambio |
|---|---|
| `DESIGN.md` | Nuevo: paleta, tipo, espaciado, radios, sombras, botones, badges (+ mapeo de estados del backend), layout, reglas, migración |
| `src/styles/tokens.css` | Nuevo: tokens `--sn-*` (+ reduced motion) |
| `src/styles/admin-kit.css` | Nuevo: `sn-btn*`, `sn-badge*` (todavía sin uso) |
| `src/main.jsx`, `index.html` | Importa tokens y kit; Manrope; `lang="es"` |
| `components/layout/Dashboard/Dashboard.jsx` | Shell nuevo: sidebar navy colapsable (persistido en `sn.sidebar.collapsed`), cuenta con popover (Mi perfil / Cerrar sesión), header con título según la ruta, off-canvas < 900px, Esc cierra |
| `components/layout/Dashboard/Dashboard.module.css` | Reescrito con `var(--sn-*)`; sin clase `dark` |
| `CLAUDE.md`, `docs/ui-palette.md` | `DESIGN.md` como fuente de verdad; `ui-palette.md` marcado como reemplazado |

### Verificación

- `npm run build` OK · `npm run lint` = 19 problemas (baseline, ninguno en `Dashboard/`).
- Falta la revisión visual en el navegador con el backend levantado.

### Riesgo conocido

Las páginas de catálogo siguen con hex oscuros: hasta la Fase 2 se ven como islas oscuras sobre
la hoja clara, y los títulos con `var(--shell-text)` (claro) quedan con poco contraste.

---

## 2026-10-31 — Rediseño del panel · Fase 2 (DataTable + Tipos de alojamiento)

### Componentes nuevos (`src/components/ui/`)

| Componente | Qué hace |
|---|---|
| `DataTable` | Toolbar (buscador, filtros, botón principal), columnas configurables, orden, paginación local o de servidor, skeleton, error con reintento, vacío y "sin resultados" |
| `IconButton` | Botón de icono 32×32 con tooltip propio (hover + foco), `tone="danger"` |
| `ConfirmDialog` | Modal de confirmación sobre `<dialog>` nativo; muestra el error adentro sin cerrarse |
| `StatusBadge` | Envoltorio de `sn-badge` |

API y reglas → `DESIGN.md` (sección Componentes).

### Tipos de alojamiento

| Archivo | Cambio |
|---|---|
| `TypesHotel/HotelTypeComponent.jsx` | Tarjetas → `DataTable` (Nombre, ID, Unidad, Estado, acciones). Filtros de estado y unidad. Eliminar abre un `ConfirmDialog`; el 409 se muestra en el modal. Se sacaron el `confirm()`/`alert()` del borrado. `load`, `handleSubmit`, `handleCreate` y `handleEdit` no cambiaron |
| `TypesHotel/HotelType.module.css` | Reescrito con `--sn-*` |
| `TypesHotel/HotelTypeCard.jsx` + `.module.css` | Borrados (solo se usaban acá) |

- `loading` arranca en `true` para no mostrar el vacío durante un instante antes de la primera carga.
- Se quitó el h1 duplicado, porque el header del shell ya muestra el título.
- `HotelTypeForm` no se tocó: sigue inline, con `alert` de validación, dentro de una card clara. Pasa a drawer en la Fase 3.

### Verificación

- `npm run build` OK · `npm run lint` = 19 (baseline; el único problema en `TypesHotel/` es el `set-state-in-effect`
  preexistente de `HotelTypeForm`). Hubo que evitar `icon: Icon` en la desestructuración: la regla
  `no-unused-vars` de este repo no ve el uso en JSX de un parámetro renombrado.
- Pendiente: revisión visual en el navegador (en la sesión no estaba disponible la extensión de Chrome).

---

## 2026-10-31 — Rediseño del panel · Fase 3 (DataTable en los 7 catálogos)

Hecho un módulo a la vez, con build + lint y chequeo contra la API después de cada uno.
Antes de empezar se consultó la forma real de los datos a la API levantada, y eso destapó varios bugs.

### Piezas compartidas

| Archivo | Qué es |
|---|---|
| `ui/ConfirmDialog/useConfirmDelete.js` | Hook del flujo de borrado (target / loading / error; 409 → mensaje propio). Tipos también pasó a usarlo |
| `ui/FilterSelect/FilterSelect.jsx` + `options.js` | Select de filtro + `STATE_OPTIONS` + `optionsFrom(rows, …)` |
| `ui/catalog.module.css` | Layout común de las páginas de catálogo (reemplaza los `*Page.module.css` duplicados) |
| `Utils/apiError.js` | `apiErrorMessage(err)`, `unwrapList(res)` |
| `admin-kit.css` | `.sn-select` |
| `DataTable` | `rowActions[].disabled` (para el botón Permisos de Usuarios sin perfil) |

### Por módulo

| Módulo | Columnas | Bugs corregidos de paso |
|---|---|---|
| Países | Nombre · ID · Estado | — |
| Departamentos | Nombre · País · ID · Estado | Al editar, el select de país salía vacío (el form lee `depPaiSec`, la API manda `countryResponseDto`); se pasa `depPaiSec` en la fila |
| Ciudades | Nombre · Departamento · País · ID · Estado | La API solo trae `citDepSec`: se mostraba **el número** del departamento. Se cruza con `/department/all`. Al editar, el departamento tampoco se precargaba |
| Categorías | Nombre · ID · Estado | `sort` sin validar que fuera array |
| Características | Icono · Nombre · ID · Estado | La tarjeta leía `feaState` y la API manda `feaEst`: **todas salían "Activo"**. El form quedaba siempre abierto y "Nueva característica" nunca aparecía |
| Usuarios | Usuario (iniciales, nombre, email) · Perfil · Anfitrión · ID | Si el borrado fallaba, el modal quedaba abierto sin mensaje. Se quitaron las estadísticas engañosas |
| Hoteles | Hotel (miniatura, nombre, dirección) · Ciudad · Tipo · Costo/noche · Categorías · Estado | `/hotel/all` devolvía solo los **primeros 10** (`size` por defecto del backend); ahora `getHotels(0, 1000)`. La búsqueda por ciudad usaba `city.citName` (no existe; es `hotCitName`). La miniatura se caía con `hotelImagesUrl=[]` y le anteponía la URL del backend a la imagen de Pexels. Un fetch fallido dejaba la página cargando para siempre |

### Verificado contra la API (con registros de prueba creados y borrados)

- Borrar un país con departamentos → `409 / 1017` → el modal muestra "el país tiene departamentos asociados".
- `GET /hotel/all?size=3` → 3 de 10; `size=1000` → 10 de 10.
- **Bug abierto (no se tocó el form):** `POST`/`PUT /feature` ignoran `feaState`; el backend lee `feaEst`. Crear
  una característica como "Inactiva" la guarda "A", y editar el estado no cambia nada. → Fase 4.
- Nota: `POST /feature` responde `feaSec: null` aunque el registro sí se crea. Es un problema del backend.

### Archivos borrados

`Country/CountryCard*`, `CountryPage.module.css`, `Department/DepartmentCard*`, `DepartmentPage.module.css`,
`City/CityCard*`, `CityPage.module.css`, `Categories/CategoryCard*`, `Category.module.css`,
`Feature/FeatureCard*`, `User/UserCard*`, `Hotel/HotelTable*`, `TypesHotel/HotelType.module.css`.

### Verificación

`npm run build` OK · `npm run lint` = **18** (baseline 19: desapareció el `set-state-in-effect` de `HotelsPage`).
Falta la revisión visual en el navegador.

---

## 2026-10-31 — Rediseño del panel · Fase 4 (pulido: forms, responsive, interacción)

### Decisión

Un único patrón para crear/editar: **panel lateral claro** (`FormDrawer`) en los 8 catálogos. Reemplaza los forms inline
(empujaban la tabla), el drawer oscuro de Hoteles y el modal propio de Usuarios.

### Componentes nuevos

| Archivo | Qué es |
|---|---|
| `ui/FormDrawer/` | `<dialog>` lateral: foco al primer campo, Esc/fondo cierran, banner con el error del backend, cierre animado (con timeout de respaldo para reducir movimiento), pantalla completa en < 600px |
| `ui/Form/` | `Field` (render prop con id + aria), `FieldRow`, `FormSection`, `Switch`, `SegmentedControl`, `ChipGroup` |
| `admin-kit.css` | `sn-input`, `sn-textarea`, `sn-select--block`, estados `aria-invalid`, press en `sn-btn` |

### Forms

Todos con validación inline (sin `alert()`), el estado inicializado al montar (`key` por registro desde el padre) y el
`handleSubmit` del padre sin `alert` ni cierre (los errores suben al banner).

| Form | Notas |
|---|---|
| País · Categoría · Tipo | Tipo usa `SegmentedControl` para las unidades |
| Característica | **Bug:** envía/lee `feaEst`. Verificado contra la API: crear "Inactiva" → `feaEst: 'I'`; editar → cambia |
| Departamento · Ciudad | País/departamento requeridos (antes un país vacío viajaba como `0`). Leen el padre directo de la API (`countryResponseDto`, `citDepSec`). Ciudad ya no deja una promesa rechazada sin aviso |
| Usuario | De modal propio a drawer; valida el formato del email |
| Hotel | **Bug:** agrega `typeId` (antes crear daba `404/1008`, confirmado contra la API). Secciones, `ChipGroup`, dropzone con miniaturas animadas. Conserva `hotConfirmReq`/`hostId` al editar |

### Bug del backend encontrado (con workaround)

`POST /hotel/save` con `featureIds` → **500**. Probado campo por campo: `city`, `hostId`, `categoryIds` andan; `featureIds`
rompe. Causa en `HotelService.save()`: arma las `Feature` con `featureMapper::toEntity` (entidades nuevas, desconectadas).
En `update()` funciona porque el hotel está en la sesión. **Workaround en `HotelForm`:** crear sin características y
aplicarlas con un `PUT`. Verificado: el hotel queda con tipo, características y categorías. Todos los hoteles de prueba se borraron.

### Responsive e interacción

Columna de acciones `sticky` (con sombra en móvil), hover de fila con `--sn-canvas`, acciones al 55% hasta pasar el
mouse (solo con mouse), filtros al 50% y botón principal a todo el ancho en móvil, transiciones en campos, chips y switch.

### Limpieza

Borrados: `Country/CountryComponent.css` (estilos globales `.country-form`), `DepartmentForm.module.css`,
`CityForm.module.css`, `FeatureForm.css`, `UserForm.module.css`. `globals.css` queda solo con el reset y la
scrollbar (se quitaron `drawer-*`, `form-section*`, `.btn-primary/.btn-ghost/.btn-icon`, que ya nadie usaba).
`catalog.module.css` pierde `formCard`/`formTitle`.

### Entorno

En esta parte de la sesión, las herramientas de edición de archivos fallaban al escribir en el repo (`ENOENT` del archivo
temporal) y `cp` desde bash devolvía "Permission denied" en `HotelForm.jsx`. Se escribió con Python y con `Copy-Item` de
PowerShell. Al pasar texto a Python por stdin en Windows hay que decodificar como UTF-8 (`sys.stdin.buffer`): con la
codificación por defecto se rompen las tildes.

### Verificación

`npm run build` OK · `npm run lint` = **13** (antes 18: desaparecieron los `set-state-in-effect` de los forms).
Pendiente: revisión visual en el navegador.

---

## 2026-10-31 — Registro de deuda técnica

Se creó [`DEUDA_TECNICA.md`](./DEUDA_TECNICA.md) para tener en un solo lugar el estado de los bugs y pendientes, que
estaban repartidos entre esta bitácora, los planes y `ARQUITECTURA.md`. Se cargó con lo encontrado en la sesión:
**17 abiertas** (DT-001…DT-017; 7 de origen backend) y **18 resueltas** (DT-018…DT-035). Antes de cargar cada abierta
se verificó en el código que siguiera vigente. Regla nueva en `CLAUDE.md` (Flujo de planes): bug o atajo → fila en
Abiertas; resuelto → se mueve a Resueltas; nunca se borra.

---

## 2026-10-31 — Autocompletado del campo "Destino"

**Requerimiento:** sugerencias mientras se escribe en el buscador de hoteles, consumiendo el endpoint de Spring Boot.

### Contrato (leído del backend y probado con curl)

`GET /api/hotel/suggestions?q=` → `List<SearchSuggestionDto>` **crudo** (sin `ApiResponse`), público.
`record SearchSuggestionDto(String type, Integer id, String name)`, con `type` = `"CITY"` (`id` = `citSec`) o `"HOTEL"` (`id` = `hotSec`).
Máximo 10; `q` con menos de 2 caracteres devuelve `[]`. Ejemplo: `q=bogo` → Bogotá (CITY) + Hostal Andino Bogotá (HOTEL).

### Decisiones (con el usuario)

| # | Decisión |
|---|---|
| A1 | Elegir una **ciudad** llena el campo (el buscador filtra por `citName`). Elegir un **hotel** llena el campo y **navega a `/hoteles/:id`** (como indica el DTO). Escribir el nombre de un hotel en el filtro por ciudad no devolvería nada |
| A2 | Va en los **dos** campos "Destino": el home (`HotelComponent`) y `/hoteles` (`HotelFilters`), con un solo componente |

### Implementación

| Archivo | Qué hace |
|---|---|
| `hotelService.getSearchSuggestions(q, { signal })` | Usa la instancia `api`; `signal` para cancelar |
| `Hotel/DestinationAutocomplete/useSearchSuggestions.js` | Lógica: mínimo 2 caracteres, debounce de 300 ms (`setTimeout` en el efecto), `AbortController` por búsqueda (el cleanup cancela la anterior), contador de petición para descartar respuestas viejas, `retry`. El estado (`idle`/`loading`/`success`/`error`) se **deriva** en el render: sin `setState` síncrono en el efecto |
| `Hotel/DestinationAutocomplete/DestinationAutocomplete.jsx` + CSS | Presentación: combobox ARIA (`aria-activedescendant`, listbox, región `aria-live`), ↑/↓ circular, Enter (elige o, si no hay resaltado, busca como antes), Esc, Tab, clic afuera, coincidencia en negrita sin distinguir tildes, ícono y etiqueta Ciudad/Hotel, estados de carga (los resultados anteriores se atenúan, no se borran), vacío y error con "Reintentar" |

- **Portal:** la lista se renderiza en `document.body` con `position: fixed`, porque `.hotel-header` (el hero del home) tiene
  `overflow: hidden` y la cortaría. Se reposiciona en `scroll`/`resize` con `requestAnimationFrame`.
- **Estilo:** la paleta del sitio público (`HotelFilters.module.css`), no los tokens del panel admin.
- El input conserva la clase de cada buscador (`search-input city-input` / `hf-input`).

### Hallazgo → DT-036

Con un token inválido en `localStorage`, el interceptor de `api.js` lo adjunta y el backend responde **401 en endpoints
públicos** (sugerencias y también `findByHotel`); sin token responde 200. Ya pasaba antes de este cambio y afecta a toda la
búsqueda pública, así que no se parcheó solo para las sugerencias: en el autocompletado se ve como un error con "Reintentar".

### Verificación

- `npm run build` OK · `npm run lint` = 13 (sin cambios; ningún problema en los archivos nuevos).
- Endpoint probado con curl (`bogo`, `po`, `zzzz`, `b`, token inválido). Resaltado sin tildes probado con Node
  (`bogo` → **Bogo**tá, `llin` → Mede**llín**, `nuñ` → **Ñuñ**oa).
- **Pendiente:** prueba en el navegador (debounce y cancelación en la pestaña Network, teclado, portal sobre el hero).
  En la sesión no estaba disponible la extensión de Chrome.

---

## 2026-11-01 — Calendario del detalle con fechas ocupadas

Implementación de [`calendario-fechas-ocupadas.md`](./calendario-fechas-ocupadas.md) (Fase 6 · Bloque D, parcial).

| Archivo | Cambio |
|---|---|
| `package.json` | Nuevas dependencias `@mui/x-date-pickers` (v9, compatible con MUI 7) y `dayjs` |
| `services/hotelServices/hotelService.js` | `getUnavailableDates(hotSec, { from, to, signal })` → `res.data.data`. Usa `axios` directo y no `api`, para no mandar un token vencido a un endpoint público (DT-036) |
| `components/HotelDetail/BookingCard.jsx` + CSS | Los `<input type="date">` con fechas fijas pasan a `DatePicker` de MUI (locale `es`). Llegada: deshabilita días pasados y bloqueados. Salida: desde llegada + 1 hasta el primer día bloqueado inclusive (el día de salida puede estar ocupado). Si la llegada cambia y la salida queda inválida, se limpia. Noches y total se calculan del rango. Botón "Reservar ahora" deshabilitado sin rango válido o con `totalUnits = 0`; aviso si falla la carga |
| `pages/HotelDetailPage.jsx` | Pasa `hotSec` (el `id` de la ruta) al `BookingCard` |

- Las fechas se comparan como string `YYYY-MM-DD` (`dayjs().format`), sin pasar por `new Date(iso)` (que corre el día por UTC).
- Es una guía visual: la validación definitiva de cruce es del backend → **DT-037**.

### Verificación

- `npm run build` OK · `npm run lint` = 13 (sin cambios).
- `curl /api/hotel/1/unavailable-dates` → `totalUnits: 1`, bloqueados `2026-11-04…06`.
- **Pendiente:** prueba en el navegador del detalle del hotel 1.

### Rediseño visual del calendario (mismo día)

Ticket: *las fechas con reservas deben ser fácilmente distinguibles*. Se mantienen los dos calendarios
separados (Llegada / Salida), con un estilo inspirado en un selector de rango limpio.

| Archivo | Cambio |
|---|---|
| `components/HotelDetail/BookingDay.jsx` | Nuevo. `BookingDay` (slot `day`, envuelve `PickerDay` de v9): días reservados **tachados sobre rojo suave** con `title="Ocupado"` (se ven igual en Llegada, donde están deshabilitados, y en Salida, donde el primer ocupado es elegible); rango elegido como píldora gris. `CalendarLegend` (slot `actionBar`): leyenda Ocupado / Seleccionado + "Limpiar" (y "Aceptar" solo en móvil, porque ahí el picker no cierra al elegir) |
| `BookingCard.jsx` | `slots`/`slotProps` compartidos por los dos pickers; pista fija "Los días tachados en rojo ya están reservados" si hay fechas ocupadas |
| `BookingCard.module.css` | Popover redondeado (`.pickerPaper` en `desktopPaper`/`mobilePaper`), días circulares, seleccionado en `--text`, pasados en gris claro (distinto de ocupado) |

- `npm run build` OK · `npm run lint` = 13. **Pendiente:** revisión visual en el navegador.

---

## 2026-11-03 — Favoritos + arreglo de fechas en BookingCard

### Fechas de la card de reserva

`BookingCard.module.css`: "Llegada" empujaba a "Salida" fuera de la card porque el DatePicker no se encogía
(`1fr` con `min-width: auto`). Se usa `minmax(0, 1fr)` + `min-width: 0` en el input, un ícono de calendario más
compacto y, con un container query, los dos campos se apilan si la card mide menos de 300px.

### Favoritos (plan `docs/planes/completados/favoritos-frontend.md`)

| Archivo | Cambio |
|---|---|
| `services/favoriteServices/favoriteService.js` | Nuevo. Consume `/api/favorites` (desenvuelve `.data`) |
| `context/FavoritesContext.jsx` + `main.jsx` | Nuevo provider: ids favoritos del usuario en un `Set` atado al `user` (logout lo vacía); toggle inmediato con reversión |
| `hooks/useFavoriteToggle.js` | Nuevo. Sin sesión → `/login` con `state.from` |
| `pages/Auth/LoginPage.jsx`, `guards/ProtectedRoute.jsx` | Login y volver: el login vuelve a `state.from` (sirve también para reservar) |
| `components/Hotel/HotelCard.jsx` + `HotelComponent.css` | 🔖 → corazón (rojo y relleno si es favorito) |
| `pages/HotelDetailPage.jsx` + `.module.css` | Botón "Guardar" ↔ "Guardado" |
| `pages/FavoritesPage.jsx` + `.module.css`, `App.jsx`, `NavBarComponent.jsx` | Ruta `/favoritos` protegida + enlace "Mis favoritos" en el menú del perfil |

- Nueva deuda: DT-038 (el admin va a `/admin` después del login y esa ruta no existe).
- `npm run build` OK · `npm run lint` = 13. **Pendiente:** revisión visual en el navegador.

---

## 2026-11-04 — "Mis favoritos" con permiso RBAC + lista

Plan: [`planes/en-curso/favoritos-lista.md`](./planes/en-curso/favoritos-lista.md).

| Archivo | Cambio |
|---|---|
| `constants/modules.js`, `constants/moduleIcons.js` | `MY_PROFILE` y `FAVORITES` (`"Mis favoritos"`, igual que el backend); íconos `UserRound` y `Heart` en el sidebar |
| `App.jsx` | `/favoritos` y la nueva `/dashboard/favorites` exigen `requiredSubModule="Mis favoritos"` |
| `pages/FavoritesPage.jsx` + `.module.css` | Prop `inPanel` (sin `<h1>` dentro del panel), contador, estados vacío y error en tarjeta con "Reintentar"; si se quitan todas las cards de una página, retrocede o vuelve a pedir la primera |
| `components/layout/Navbar/NavBarComponent.jsx` + `.css` | "Mis favoritos" solo con permiso; el menú mobile suma Dashboard, Mi Perfil y Mis favoritos |

- El permiso se siembra en el backend (`DataInitializer`, módulo "Mi Cuenta", acciones R y D, perfiles Administrador y Usuario).
  Verificado contra `GET /api/profiles/{id}/modules`. Hay que volver a iniciar sesión para que se recarguen los módulos.
- El ajuste de página se hace durante el render y no en un efecto: la regla `react-hooks/set-state-in-effect` lo bloquea.
- Nueva deuda: DT-039 (perfiles creados desde el panel no reciben "Mis favoritos").
- `npm run build` OK · `npm run lint` = 13. **Pendiente:** revisión visual en el navegador.

---

## 2026-11-04 — Req. #27: compartir alojamientos en redes

Plan: [`planes/en-curso/compartir-redes.md`](./planes/en-curso/compartir-redes.md).

| Archivo | Cambio |
|---|---|
| `components/HotelDetail/ShareModal.jsx` + `.module.css` | Nuevo modal (`Dialog` de MUI, pantalla completa en mobile): vista previa con imagen, nombre, ciudad y descripción breve; mensaje personalizado (280 caracteres); Facebook, X, WhatsApp, Telegram, Instagram y "Más opciones" (`navigator.share`); copiar enlace |
| `pages/HotelDetailPage.jsx` | El botón "Compartir" (que no hacía nada) abre el modal |

- `lucide-react` v1 no trae íconos de marcas: se usan los de `@mui/icons-material`.
- Instagram no tiene URL para compartir desde la web: se copia el mensaje y se abre instagram.com. Facebook solo toma la URL.
- Nueva deuda: DT-040 (sin Open Graph, las redes no muestran vista previa).
- `npm run build` OK · `npm run lint` = 13. **Pendiente:** revisión visual en el navegador.
