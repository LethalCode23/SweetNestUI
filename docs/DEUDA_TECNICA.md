# Deuda técnica — SweetNestUI

Bugs, atajos y pendientes conocidos. **Nunca se borran filas:** cuando una se resuelve, se mueve a
**Resueltas** con fecha, solución y referencia. La historia de cómo se llegó a cada cosa está en
[`BITACORA.md`](./BITACORA.md); las reglas estables, en [`CLAUDE.md`](../CLAUDE.md).

- **Prioridad:** 🔴 rompe una función · 🟠 riesgo o workaround activo · 🟡 limpieza / mejora
- **Origen:** `front` · `back` (bug del backend detectado desde el front; si hace falta se replica en `SweetNestApp/docs/`)
- **IDs:** `DT-001`, `DT-002`… correlativos. No se reutilizan y una deuda resuelta conserva su ID.

## Cómo se usa

1. Encuentras un bug, un atajo o algo pendiente → agrega una fila en **Abiertas** con el siguiente ID libre.
2. Lo resuelves → mueve la fila a **Resueltas** (con la fecha, cómo se resolvió y la referencia a la bitácora o al commit).
3. Si un workaround del código depende de una deuda, el comentario del código cita su ID (`// DT-001`).

---

## Abiertas

| ID | Prio | Origen | Área | Problema | Dónde | Workaround / siguiente paso | Detectado |
|---|---|---|---|---|---|---|---|
| DT-001 | 🟠 | back | Hoteles | `POST /hotel/save` responde **500** si trae `featureIds`: `HotelService.save()` arma las `Feature` con `featureMapper::toEntity` (entidades nuevas, desconectadas). En `update()` funciona | `SweetNestApp` `service/impl/HotelService.java` | **Workaround activo** en `HotelForm.jsx`: crea sin características y las aplica con un `PUT`. Arreglo: usar `featureRepository.findAllById` en `save()` y quitar el workaround | 2026-10-31 |
| DT-002 | 🟡 | back | Características | `POST /feature` responde `feaSec: null` aunque el registro sí se crea | `SweetNestApp` `FeatureController`/service | Devolver la entidad persistida | 2026-10-31 |
| DT-003 | 🟠 | back | Hoteles | No hay endpoint para borrar una imagen ya guardada: el form solo la oculta y al recargar vuelve a aparecer | `HotelForm.jsx` (`removeExistingImage`) | Endpoint `DELETE /hotel-images/{id}` y conectarlo al guardar | 2026-10-31 |
| DT-004 | 🟡 | front | Hoteles | Las imágenes nuevas se suben con prioridad `1, 2…` sin importar las existentes, así que pueden duplicar la prioridad de una ya guardada | `HotelForm.jsx` (`uploadHotelImage(hotSec, i + 1, …)`) | Prioridad = cantidad existente + i + 1 | 2026-10-31 |
| DT-005 | 🟠 | front | Permisos | La ruta `type-hotels` exige el submódulo `"Hoteles"`, pero los botones usan `MODULES.HOTEL_TYPES` (`"Tipos"`) | `App.jsx`, `constants/modules.js` | Confirmar el nombre real del submódulo en el backend y unificar | 2026-10-31 |
| DT-006 | 🟠 | front | Permisos | El botón **Permisos** de Usuarios no chequea permiso, y la ruta `/dashboard/profiles/:profileId/permissions` solo pide sesión | `UsersPage.jsx`, `App.jsx` | Agregar `requiredSubModule` a la ruta y chequeo de acción al botón | 2026-10-31 |
| DT-007 | 🟡 | back | Hoteles | `GET /hotel/all` no filtra por nombre: el admin pide `size=1000` y busca en el cliente. No escala si el catálogo crece mucho | `HotelsPage.jsx` (`FETCH_SIZE`) | Filtro por nombre en el backend y `DataTable` en modo servidor (`pagination`) | 2026-10-31 |
| DT-008 | 🟡 | back | Búsqueda | `findByHotel` recibe `checkIn`/`checkOut` pero los ignora: falta la búsqueda por disponibilidad | `hotelService.findByHotel` | Plan de reservas del backend, Fase 4 | 2026-10-31 |
| DT-009 | 🟡 | back | Hoteles | Mandar `hostId` vacío en el update no desasigna al anfitrión (`null` = no cambia) | `SweetNestApp` `HotelService.update()` | Pendiente del backend (Fase 2A) | 2026-10-25 |
| DT-010 | 🟡 | back | Docs | `API.md` del backend no documenta los endpoints de la Fase 1 (tipos, unidades, reservas) | `SweetNestApp/API.md` | Documentarlos | 2026-10-25 |
| DT-011 | 🟡 | front | Rutas | `/dashboard` no tiene ruta `index`: entrar ahí muestra el panel con el contenido vacío | `App.jsx` | Ruta index con un resumen o redirección al primer submódulo permitido | 2026-10-04 |
| DT-012 | 🟡 | front | UI | Perfiles, Permisos y Mi perfil siguen con el tema oscuro viejo (`.dark`, `--shell-*`, `docs/ui-palette.md`) | `components/Profile`, `components/PermissionsPage`, `pages/UserProfilePage` | Rediseño, Fase 5 | 2026-10-31 |
| DT-013 | 🟡 | front | Limpieza | Código muerto: `HotelAdminCard.jsx` + `.css` (además importa `../../utils/permissions`, que no existe) y `HotelsCrudList.css` | `components/Hotel/` | Borrar | 2026-10-31 |
| DT-014 | 🟡 | front | Calidad | Baseline de lint con 13 problemas (variables sin usar en `LoginPage` y `HotelSearchPage`, dependencias de efectos, etc.) | varios | Bajarlo a 0 de a poco; nunca subirlo | 2026-10-31 |
| DT-015 | 🟡 | front | Limpieza | `console.log` que quedaron en services (payload, archivo de imagen, id de usuario) | `hotelService.js` (create/update, `uploadHotelImage`), `userService.deleteUser` | Quitarlos | 2026-10-31 |
| DT-016 | 🟡 | front | Config | `BASE_URL` de `Js/constants.js` duplica `Environment.API_URL_IMG` | `HotelCard.jsx`, `HotelForm.jsx` | Usar solo `Environment` | 2026-10-31 |
| DT-017 | 🟡 | front | Permisos | Características acepta el nombre viejo de submódulo `"Features"` como respaldo | `FeatureComponent.jsx`, `FeatureForm.jsx` | Quitarlo cuando se confirme que el backend solo usa `"Características"` | 2026-10-31 |
| DT-036 | 🟠 | front + back | Sesión | Con un token inválido o vencido en `localStorage`, `api.js` lo manda igual y el backend responde **401 en endpoints públicos**: la búsqueda (`findByHotel`) y las sugerencias dejan de funcionar hasta cerrar sesión. Probado con curl (`Bearer xxx` → 401; sin token → 200) | `services/api.js`; filtro JWT del backend | Front: interceptor de respuesta que ante un 401 limpie la sesión y reintente sin token (o no adjunte el token en GET públicos). Back: que el filtro JWT deje pasar las rutas `permitAll` aunque el token sea inválido | 2026-10-31 |
| DT-037 | 🟡 | back | Reservas | El calendario del detalle (`BookingCard`) bloquea solo los días sin **ninguna** unidad libre: en hoteles con varias unidades un rango puede pasar la validación visual sin que haya **una misma** unidad libre todas las noches. Además solo se cargan 6 meses (`from` = hoy); más allá no hay días bloqueados | `BookingCard.jsx` (`getUnavailableDates`) | Validación de cruce al crear la reserva (plan de reservas del backend, Fase 2 · Bloque B) y mostrar `1011`; opcional: recargar por mes visible con `onMonthChange` | 2026-11-01 |
| DT-038 | 🟠 | front | Sesión | Tras el login, el admin va a `/admin`, ruta que no existe en `App.jsx` → cae en `NotFoundPage` (solo si no venía de otra página con `state.from`) | `pages/Auth/LoginPage.jsx` | Redirigir a `/dashboard` | 2026-11-03 |

---

## Resueltas

| ID | Origen | Problema | Solución | Resuelto | Ref. |
|---|---|---|---|---|---|
| DT-018 | front | Hoteles: el panel solo mostraba los **primeros 10** (`/hotel/all` pagina en el servidor y no se mandaba `size`) | `getHotels(page, size)` y el admin pide `size=1000` (ver DT-007) | 2026-10-31 | BITACORA · Fase 3 |
| DT-019 | front | Hoteles: la búsqueda por ciudad usaba `city.citName`, que la API no manda (es `hotCitName`) | Búsqueda por `hotCitName` en el `DataTable` | 2026-10-31 | BITACORA · Fase 3 |
| DT-020 | front | Hoteles: la miniatura se rompía con `hotelImagesUrl=[]` y le anteponía la URL del backend a la imagen de reemplazo externa | `hotelImagesUrl?.[0]?.hotImgUrl` + ícono de reemplazo propio | 2026-10-31 | BITACORA · Fase 3 |
| DT-021 | front | Hoteles: si el fetch fallaba, la página quedaba cargando para siempre | `try/catch` + estado de error con "Reintentar" | 2026-10-31 | BITACORA · Fase 3 |
| DT-022 | front | Hoteles: **crear siempre fallaba** con `404/1008` porque el form no enviaba `typeId` | Selector de tipo (requerido) en `HotelForm` | 2026-10-31 | BITACORA · Fase 4 |
| DT-023 | front | Ciudades: se mostraba **el número** del departamento (la API solo trae `citDepSec`) | Se cruza con `/department/all`; se agregan las columnas Departamento y País | 2026-10-31 | BITACORA · Fase 3 |
| DT-024 | front | Ciudades: al editar no se precargaba el departamento | `CityForm` lee `citDepSec` | 2026-10-31 | BITACORA · Fases 3–4 |
| DT-025 | front | Ciudades: si el guardado fallaba no había `try/catch` ni aviso (promesa rechazada sin manejar) | `FormDrawer` muestra el error del backend | 2026-10-31 | BITACORA · Fase 4 |
| DT-026 | front | Departamentos: al editar no se precargaba el país (el form no leía `countryResponseDto`) | `DepartmentForm` lee `countryResponseDto.paiSec` | 2026-10-31 | BITACORA · Fases 3–4 |
| DT-027 | front | Departamentos: un país sin elegir se enviaba como `Number(null)` = `0` | País requerido, con validación inline | 2026-10-31 | BITACORA · Fase 4 |
| DT-028 | front | Características: **todas salían "Activo"** (se leía `feaState`; la API usa `feaEst`) | La tabla lee `feaEst` | 2026-10-31 | BITACORA · Fase 3 |
| DT-029 | front | Características: el form quedaba siempre abierto y "Nueva característica" nunca aparecía | Abre y cierra como en los demás catálogos | 2026-10-31 | BITACORA · Fase 3 |
| DT-030 | front | Características: **el estado nunca se guardaba** (el form enviaba `feaState`; el backend lee `feaEst`) | `FeatureForm` envía y lee `feaEst`. Verificado contra la API | 2026-10-31 | BITACORA · Fase 4 |
| DT-031 | front | Categorías: `sort` sin validar que la respuesta fuera un array | `unwrapList` | 2026-10-31 | BITACORA · Fase 3 |
| DT-032 | front | Usuarios: si el borrado fallaba, el modal quedaba abierto sin ningún mensaje | `useConfirmDelete` + `ConfirmDialog` con el error | 2026-10-31 | BITACORA · Fase 3 |
| DT-033 | front | Usuarios: estadísticas engañosas ("Admins" = `proId === 1`; "Activos" = estado del perfil) | Se quitaron | 2026-10-31 | BITACORA · Fase 3 |
| DT-034 | front | Todos los catálogos: borrado con `confirm()` y errores con `alert()` | `ConfirmDialog` (409 con un mensaje claro) y validación inline | 2026-10-31 | BITACORA · Fases 2–4 |
| DT-035 | front | Forms: copiaban `initial` al estado dentro de un `useEffect`, así que se reseteaban cada vez que el padre se volvía a renderizar | El estado se inicializa al montar y el padre usa `key` por registro | 2026-10-31 | BITACORA · Fase 4 |
