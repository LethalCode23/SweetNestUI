# Documentación — SweetNestUI

Documentación del frontend de SweetNest. El README principal está en la [raíz del repositorio](../README.md).

| Documento | Contenido |
| :--- | :--- |
| [ARQUITECTURA.md](./ARQUITECTURA.md) | Capas, mapa de rutas, autenticación JWT, RBAC y capa de services. |
| [ui-palette.md](./ui-palette.md) | Estándar visual (tokens de color) del panel administrativo oscuro. |
| [BITACORA.md](./BITACORA.md) | Registro cronológico: una entrada por sesión/fase. |
| [planes/](./planes/) | Planes por estado: `pendientes/`, `en-curso/`, `completados/`. |
| [DEUDA_TECNICA.md](./DEUDA_TECNICA.md) | Bugs, atajos y pendientes: abiertos y resueltos (`DT-xxx`). |
| [session-2026-10-04.md](./session-2026-10-04.md) | Histórico: detalle de la sesión de unificación de paleta (resumida en la bitácora). |

Las reglas estables del proyecto y el flujo de planes están en [`CLAUDE.md`](../CLAUDE.md).

## Convenciones

- Español, tablas Markdown, checklists con `- [ ]`.
- Lo que se hace en cada sesión va como entrada nueva en `BITACORA.md` (ya no se crean `session-AAAA-MM-DD.md`).
- Verificación de calidad: `npm run build` + `npm run lint`.
