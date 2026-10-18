# Arquitectura — SweetNestUI

> Documento técnico del frontend: capas, mapa de rutas, autenticación (JWT), RBAC y capa de
> services. La fuente de verdad de los endpoints es [API.md](https://github.com/LethalCode23/SweetNestApp/blob/main/API.md)
> del backend; aquí solo se registra qué consume cada módulo del cliente.

## Capas

```
main.jsx
  └── App.jsx (createBrowserRouter)
        ├── pages/            # Vistas (públicas y dashboard)
        ├── components/       # Componentes reutilizables y de módulo
        ├── guards/           # ProtectedRoute (sesión + permisos)
        ├── context/          # AuthContext (sesión, módulos, permisos)
        ├── services/         # Capa HTTP por módulo
        │     └── api.js      # instancia axios + interceptor Bearer
        └── Environments/     # Environment.js (URL de la API)
```

Flujo de una petición:

1. Un componente llama a una función de `src/services/<modulo>/*Service.js`.
2. El service usa la instancia `api` de `src/services/api.js`.
3. El interceptor de `api.js` agrega `Authorization: Bearer <token>` desde `localStorage`.
4. La petición sale hacia `Environment.API_URL` (`http://localhost:8080/api`).

## Mapa de rutas

Definidas en `src/App.jsx`. La fuente de verdad es ese archivo; si agregas una ruta, actualiza esta tabla.

### Públicas (layout con Navbar + Footer)

| Ruta | Página | Protección |
| :--- | :--- | :--- |
| `/` | `HomePage` | — |
| `/hoteles` | `HotelSearchPage` | — |
| `/hoteles/:id` | `HotelDetailPage` | — |
| `*` | `NotFoundPage` | — |

### Autenticación (sin layout público)

| Ruta | Página | Protección |
| :--- | :--- | :--- |
| `/login` | `Auth/LoginPage` | — |
| `/register` | `Auth/RegisterPage` | — |

### Panel `/dashboard` (shell `Dashboard` con sidebar + topbar)

| Ruta | Página | `requiredSubModule` |
| :--- | :--- | :--- |
| `/dashboard` | `Dashboard` (Outlet) | sesión válida |
| `/dashboard/hotels` | `HotelsPage` | `Hoteles` |
| `/dashboard/countries` | `CountriesPage` | `Países` |
| `/dashboard/departments` | `DepartmentsPage` | `Departamentos` |
| `/dashboard/cities` | `CitiesPage` | `Ciudades` |
| `/dashboard/categories` | `CategoryPage` | `Categorías` |
| `/dashboard/features` | `FeaturesPage` | `Características` |
| `/dashboard/users` | `UsersPage` | `Usuarios` |
| `/dashboard/profiles` | `ProfilesPage` | `Perfiles` |
| `/dashboard/profiles/:profileId/permissions` | `PermissionsPage` | sesión válida |
| `/dashboard/userProfile` | `UserProfilePage` | sesión válida |

> **Pendiente conocido:** `/dashboard` no tiene ruta `index`; entrar a esa URL pinta el shell con el `<Outlet />` vacío. Ver [ui-palette.md — Pendientes](./ui-palette.md#pendientes).

## Autenticación (JWT)

### Flujo de login

1. `LoginPage` llama a `AuthServices.login(credentials)` → `POST /api/auth/login`.
2. La respuesta trae `{ user, auth: { token } }`.
3. `AuthContext.saveUser(loginData)` persiste en `localStorage`:
   - `token` — JWT usado por el interceptor de `api.js`.
   - `user` — objeto del usuario.
   - `modules` — módulos del perfil, cargados vía `GET /api/profiles/{proId}/modules`.
4. `hasSubmodulePermission(nombre)` evalúa si algún módulo tiene `entryAllowed` y un submódulo con ese nombre.

### Cierre de sesión

`AuthContext.logout()` limpia `user`, `token` y `modules` de `localStorage` y redirige al home/login según el flujo del componente.

### Persistencia

| Clave `localStorage` | Contenido |
| :--- | :--- |
| `token` | JWT (`Bearer`). |
| `user` | Datos del usuario autenticado. |
| `modules` | Árbol de módulos/submódulos/acciones del perfil. |

## RBAC (control de acceso)

### Constantes — `src/constants/modules.js`

| Constante | Valores |
| :--- | :--- |
| `MODULES` | `Hoteles`, `Países`, `Departamentos`, `Ciudades`, `Categorías`, `Usuarios`, `Perfiles`, `Características` |
| `ACTIONS` | `LIST: "R"`, `CREATE: "C"`, `UPDATE: "U"`, `DELETE: "D"` |

### Guard — `src/guards/ProtectedRoute.jsx`

```jsx
<ProtectedRoute requiredSubModule="Hoteles">
  <HotelsPage />
</ProtectedRoute>
```

Comportamiento:

1. Sin `user` → `Navigate` a `/login`.
2. Con `requiredSubModule` y `loadingModules` → `null` (espera a que carguen los permisos).
3. Con `requiredSubModule` sin permiso → `Navigate` a `/dashboard`.
4. Si pasa todo → renderiza `children` u `Outlet`.

### Helpers de permisos — `src/context/AuthContext.jsx`

| Helper | Uso |
| :--- | :--- |
| `hasSubmodulePermission(name)` | ¿El perfil puede entrar al submódulo? (evalúa `entryAllowed` + nombre del submódulo) |
| `hasActionPermission(name, code)` | ¿El perfil puede ejecutar una acción (`R`/`C`/`U`/`D`) en el submódulo? |

Los permisos de edición (asignar acciones a un perfil) se gestionan en `/dashboard/profiles/:profileId/permissions` (`PermissionsPage` + `profileServices`).

## Capa de services

Cada módulo tiene su archivo bajo `src/services/`. La base es `Environment.API_URL`.

| Módulo | Archivo | Endpoints que consume (resumen) |
| :--- | :--- | :--- |
| Auth | `AuthServices/AuthServices.jsx` | `POST /auth/login`, `POST /auth/register` |
| Hoteles | `hotelServices/hotelService.js` | `GET /hotel/findByHotel`, `GET /hotel/findDetailById/{id}`, `GET /hotel/all`, `POST /hotel/save`, `PUT /hotel/update/{id}`, `DELETE /hotel/delete/{id}`, `POST /hotel-images/save` |
| Categorías | `categoryServices/categoryService.js` | `GET /category/all`, `POST /category/save`, `DELETE /category/delete/{id}` |
| Ciudades | `cityServices/cityService.js` | `GET /city/all`, `POST /city/save`, `PUT /city/update/{id}`, `DELETE /city/delete/{id}` |
| Países | `countryServices/countryService.js` | `GET /country/all`, `POST /country/save`, `DELETE /country/delete/{id}` |
| Departamentos | `departmentServices/departmentService.js` | `GET /department/all`, `POST /department/save`, `DELETE /department/delete/{id}` |
| Features | `featureServices/featureService.js` | `GET /feature/all`, `GET /feature/{id}`, `POST /feature`, `PUT /feature/{id}`, `DELETE /feature/{id}` |
| Usuarios | `userServices/userService.js` | `GET /users/all`, `GET /profile/all`, `POST /auth/register`, `PUT /users/{id}`, `DELETE /users/{id}` |
| Perfiles | `profileServices/ProfileServices.js` | `GET /profiles/{id}/modules`, `GET /profile/all`, `PATCH .../entry-allowed`, `PATCH .../actions/{code}`, `POST/DELETE /PermissionProMod/...` |
| Permisos | `permissionsPage/permissionsPageService.js` | `GET /profiles/{id}/modules`, `PATCH /PermissionProModPer/.../actions/{code}` |

> El detalle completo (método, path, body y respuesta) de cada endpoint está en [API.md](https://github.com/LethalCode23/SweetNestApp/blob/main/API.md) del backend. Este documento solo mapea qué service consume qué.

## Configuración — `src/Environments/Environment.js`

| Variable | Valor dev | Uso |
| :--- | :--- | :--- |
| `API_URL` | `http://localhost:8080/api` | Base de `api.js` (todas las peticiones REST). |
| `API_URL_IMG` | `http://localhost:8080` | Carga de imágenes de hoteles (URLs absolutas de imagen). |

## Estilos

El tema oscuro del panel admin y los tokens de color están documentados en [ui-palette.md](./ui-palette.md). El kit compartido (`drawer`, `btn-primary`, `btn-ghost`, etc.) vive en `src/styles/globals.css`.

## Convenciones del repositorio

| Convención | Detalle |
| :--- | :--- |
| Documentos | Español, tablas Markdown, checklists con `- [ ]`. |
| Nombre de archivo CSS Module | PascalCase, coincidente con el componente. |
| Verificación | `npm run build` + `npm run lint`. Baseline de lint: 19 problemas preexistentes. |
