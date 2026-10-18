# SweetNest — Hotel Booking System (Frontend)

![Logo SweetNest](https://raw.githubusercontent.com/LethalCode23/SweetNestUI/main/src/assets/SweetNestLogo.ico)

Frontend en **React** para **SweetNest**, un sistema de reservas de alojamiento. Aplicación cliente-servidor con catálogo público de hoteles, autenticación JWT y un panel administrativo con control de acceso basado en roles (RBAC). Consume la API REST del repositorio [SweetNestApp](https://github.com/LethalCode23/SweetNestApp).

## Acerca del proyecto

SweetNest es una herramienta que optimiza y agiliza el proceso de reservas para alojamiento con su interfaz intuitiva, donde el usuario podrá navegar en búsqueda de las mejores opciones para alojarse en su destino. Permite conectar a los usuarios con las mejores ofertas de alojamiento que están disponibles actualmente.

La solución consiste en una aplicación web de arquitectura cliente-servidor. Este repositorio contiene la capa cliente; el backend REST con autenticación JWT, RBAC y persistencia H2 vive en [SweetNestApp](https://github.com/LethalCode23/SweetNestApp).

### Propuesta de valor técnica

- **Escalabilidad:** separación de responsabilidades con arquitectura cliente-servidor, lo que facilita las actualizaciones futuras del frontend o del backend.
- **Código limpio:** componentes modulares y una capa de services aislada para facilitar el mantenimiento a largo plazo.
- **Seguridad:** rutas protegidas por guards y permisos evaluados por submódulo y acción (R/C/U/D) antes de renderizar cada vista del panel.

## Funcionalidades

### Área pública (sin sesión)

| Funcionalidad | Ruta | Descripción |
| :--- | :--- | :--- |
| Home / catálogo | `/` | Cuadrícula de hoteles destacados con navegación al detalle. |
| Búsqueda de hoteles | `/hoteles` | Listado con filtros y paginación (ciudad, criterios de búsqueda). |
| Detalle de hotel | `/hoteles/:id` | Información específica, descripción e imágenes del alojamiento. |
| Inicio de sesión | `/login` | Autenticación con JWT; carga los módulos del perfil. |
| Registro | `/register` | Creación de cuenta de usuario. |

### Panel administrativo `/dashboard` (requiere sesión + permisos)

| Módulo | Ruta | Submódulo RBAC |
| :--- | :--- | :--- |
| Hoteles | `/dashboard/hotels` | `Hoteles` |
| Países | `/dashboard/countries` | `Países` |
| Departamentos | `/dashboard/departments` | `Departamentos` |
| Ciudades | `/dashboard/cities` | `Ciudades` |
| Categorías | `/dashboard/categories` | `Categorías` |
| Características | `/dashboard/features` | `Características` |
| Usuarios | `/dashboard/users` | `Usuarios` |
| Perfiles (roles) | `/dashboard/profiles` | `Perfiles` |
| Permisos del perfil | `/dashboard/profiles/:profileId/permissions` | sesión válida |
| Mi perfil | `/dashboard/userProfile` | sesión válida |

## Stack tecnológico

| Capa | Tecnología |
| :--- | :--- |
| Librería | React 19 |
| Build | Vite 7 |
| Enrutamiento | React Router DOM 6 (`createBrowserRouter`) |
| HTTP | Axios (interceptor `Authorization: Bearer`) |
| Formularios | React Hook Form + Yup |
| UI | MUI 7 + Emotion, lucide-react |
| Estilos | CSS Modules + `globals.css` |
| Lint | ESLint 9 (`eslint.config.js`) |
| Backend | Spring Boot → [SweetNestApp](https://github.com/LethalCode23/SweetNestApp) · [API.md](https://github.com/LethalCode23/SweetNestApp/blob/main/API.md) |

## Requisitos previos

- **Node.js 22 o superior** — verifica con `node -v`
- **npm** — verifica con `npm -v`
- **Backend corriendo** en `http://localhost:8080` (ver [guía del backend](https://github.com/LethalCode23/SweetNestApp#guía-de-instalación-y-ejecución)); el frontend no funciona sin la API.

## Guía de instalación y ejecución

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/LethalCode23/SweetNestUI.git
   cd SweetNestUI
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Levantar el backend** (en otra terminal, ver requisitos previos):

   ```bash
   cd ../SweetNestApp
   ./mvnw.cmd spring-boot:run   # Windows — macOS/Linux: ./mvnw spring-boot:run
   ```

4. **Ejecutar el frontend:**

   ```bash
   npm run dev
   ```

5. **Abrir** <http://localhost:5173>

### Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo Vite (puerto 5173). |
| `npm run build` | Build de producción en `dist/`. |
| `npm run preview` | Vista previa del build de producción. |
| `npm run lint` | Análisis estático con ESLint. |

### Configuración de la API

La URL del backend se define en `src/Environments/Environment.js`:

```js
export const Environment = {
    production: false,
    API_URL: 'http://localhost:8080/api',
    API_URL_IMG: 'http://localhost:8080'
};
```

- `API_URL` — base de las peticiones REST (las usa `src/services/api.js`).
- `API_URL_IMG` — base para cargar imágenes de hoteles.

> **CORS:** el backend solo acepta peticiones desde `http://localhost:5173`, el puerto de Vite en desarrollo.

## Documentación

| Documento | Contenido |
| :--- | :--- |
| [docs/ARQUITECTURA.md](./docs/ARQUITECTURA.md) | Capas, mapa de rutas, guards RBAC, `AuthContext` y capa de services. |
| [docs/ui-palette.md](./docs/ui-palette.md) | Estándar visual (tokens de color) del panel administrativo oscuro. |
| [docs/session-2026-10-04.md](./docs/session-2026-10-04.md) | Bitácora de la sesión de unificación de paleta y limpieza. |
| [SweetNestApp · API.md](https://github.com/LethalCode23/SweetNestApp/blob/main/API.md) | Documentación de los 53 endpoints del backend con cURL. |

## Estructura del proyecto

```
src/
├── App.jsx            # Definición de rutas (createBrowserRouter)
├── Environments/      # Environment.js — URL de la API
├── Js/                # Constantes globales y roles
├── Utils/             # Utilidades (permisos)
├── components/        # Componentes (Hotel, User, Profile, layout/, PermissionsPage/)
├── constants/         # MODULES y ACTIONS (R/C/U/D) del RBAC
├── context/           # AuthContext (sesión + módulos), CardContext
├── guards/            # ProtectedRoute (sesión y submódulos)
├── pages/             # Páginas públicas y del dashboard
├── services/          # Capa HTTP: api.js (axios) + *Services por módulo
└── styles/            # globals.css (kit de estilos compartido)
```

Detalle de rutas, flujo de autenticación y services en [docs/ARQUITECTURA.md](./docs/ARQUITECTURA.md).

## Pruebas

### Frontend — Sprint 1

Se diseñaron y ejecutaron pruebas basadas en las historias de usuario del Sprint 1. Las pruebas fueron realizadas de forma manual en el entorno de desarrollo, validando la persistencia de los datos en la base de datos en memoria y la correcta comunicación entre el frontend (React) y el backend (Spring Boot).

| ID | Escenario de prueba | Resultado esperado | Estado |
| :--- | :--- | :--- | :--- |
| **TC-01** | Persistencia del Header al hacer scroll. | El header permanece fijo en la parte superior. | ✅ Pass |
| **TC-02** | Visualización en dispositivos móviles. | Diseño 100% responsivo sin errores visuales. | ✅ Pass |
| **TC-03** | Registro de producto con nombre duplicado. | El sistema muestra alerta de error y bloquea el registro. | ✅ Pass |
| **TC-04** | Aleatoriedad del catálogo en el Home. | Los productos cambian de orden al recargar y no se repiten. | ✅ Pass |

> El plan de pruebas del backend (27 casos, cURL) está en [PLAN_DE_PRUEBAS.md](https://github.com/LethalCode23/SweetNestApp/blob/main/PLAN_DE_PRUEBAS.md).

### Verificación de calidad

```bash
npm run lint    # ESLint — baseline: 19 problemas preexistentes (16 errors, 3 warnings)
npm run build   # Build de producción
```

## Diseño

### Logotipo

![Logo SweetNest](https://raw.githubusercontent.com/LethalCode23/SweetNestUI/main/src/assets/SweetNestLogo.ico)

### Paleta de colores

![Paleta de Colores](https://raw.githubusercontent.com/LethalCode23/SweetNestUI/main/src/assets/PaletadeColores.png)

Los tokens del tema oscuro del panel administrativo están documentados en [docs/ui-palette.md](./docs/ui-palette.md).
