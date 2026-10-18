# Estándar visual — Tema oscuro del panel admin

Tokens consolidados el 2026-10-04. El objetivo es que Perfiles, Usuarios, Hoteles y Mi
Perfil compartan una sola identidad de color dentro del panel `/dashboard`.

> **Alcance de este documento.** Describe el **tema oscuro del panel administrativo**, no la
> paleta de marca del producto. La paleta oficial del proyecto está en
> `src/assets/PaletadeColores.png` y estos tokens **aún no se han validado** contra esa imagen.
> Ver [Pendientes](#pendientes).

## Tokens

Valores verificados en los módulos ya migrados. La columna de referencia indica el archivo
donde se consolidó originalmente cada valor.

| Rol | Valor | Referencia |
| :--- | :--- | :--- |
| Canvas del shell | `#0f1623` | `App.css:8` (`--shell-bg`) |
| Card / surface | `#0a1020` | `HotelsPage.module.css:40,104` |
| Modal / panel | `#111827` | `globals.css:23` (`.drawer-panel`) |
| Borde | `#1e2d45` | `HotelsPage.module.css:41,105` |
| Borde hover | `#2d4a6a` | `HotelsPage.module.css:46` |
| Título | `#f1f5f9` | `HotelsPage.module.css:17,61` |
| Texto | `#e2e8f0` | `HotelsPage.module.css:107` |
| Muted fuerte | `#94a3b8` | `HotelsPage.module.css:24,76` |
| Muted | `#475569` | `HotelsPage.module.css:24,76,114` |
| Primario / focus | `#2563eb` | `HotelsPage.module.css:117,144` |
| Primario hover | `#1d4ed8` | `globals.css:121` (`.btn-primary:hover`) |
| Anillo de focus | `rgba(37, 99, 235, 0.12)` | `HotelsPage.module.css:118` |
| Gradiente de avatar | `linear-gradient(135deg, #1d4ed8, #2563eb)` | `UserProfilePage.module.css:100` |
| Success (fg / bg) | `#4ade80` / `#0f3d2e` | `App.css:49-50` (`.dark`) |
| Danger (fg / bg) | `#f87171` / `#3d1515` | `App.css:51-52` (`.dark`) |
| Error border | `rgba(248, 113, 113, 0.3)` | derivado de `--danger` |

## Reglas

1. **El `.root` de cada página no define background.** Hereda el `#0f1623` del shell admin.
   Pintar un fondo propio fue la causa raíz del desajuste de Perfiles.
2. **Hex hardcodeado en CSS Modules.** No usar `var(--*)` para color dentro de un módulo.
   Ver [Trampa 1](#trampa-1-var---resuelve-al-tema-claro).
3. **Todo elemento con texto o icono sobre superficie oscura declara `color` explícito.**
   Ver [Trampa 2](#trampa-2-sin-color-explícito-se-hereda-el-azul-marino).
4. **Botón primario: `#2563eb` plano**, sin gradiente de acento.
5. **Los estados de éxito y error usan el par fg/bg** de la tabla, no solo el color de texto.
6. **Nada de acentos propios de un módulo.** No introducir otro color de marca; si hace
   falta un tono nuevo, sale de la tabla de tokens.

## Trampas del proyecto

Estas tres causas explican la mayoría de los colores que quedaron mal. Están documentadas
porque no son evidentes al leer un CSS Module.

### Trampa 1: `var(--*)` resuelve al tema CLARO

`Dashboard.jsx` aplica la clase `dark` únicamente a dos elementos:

| Elemento | Línea | Lleva `dark` |
| :--- | :--- | :--- |
| `.sidebar` | `Dashboard.jsx:48` | Sí |
| `.topbar` | `Dashboard.jsx:101` | Sí |
| `.content` | `Dashboard.jsx:151` | **No** |

Como `.content` no la lleva, todo `var(--*)` dentro de una página del admin resuelve contra
`:root` (`App.css:2-32`), que es el tema **claro**. Casos reales que fallaron:

| Token | Resuelve a | Problema |
| :--- | :--- | :--- |
| `var(--nav-active-bg)` | `#E6F0F7` (`App.css:27`) | chip blanco sobre fondo oscuro |
| `var(--nav-active-fg)` | `#115D8C` (`App.css:28`) | azul de marca, no el `#60a5fa` del estándar |
| `var(--text)` | `#0B3B59` (`App.css:14`) | azul marino, ilegible sobre oscuro |
| `var(--grad-avatar)` | teal `#115D8C → #9498F2` (`App.css:25`) | fuera de la paleta |
| `var(--primary)` | `#115D8C` (`App.css:10`) | foco teal en vez de `#2563eb` |
| `var(--ring)` | `#115D8C33` (`App.css:19`) | anillo del color equivocado |

### Trampa 2: sin `color` explícito se hereda el azul marino

`App.css:66` define `color: var(--text)` en `body`, es decir `#0B3B59`. Cualquier SVG o texto
sin color propio **hereda azul marino**, porque no existe color inicial en CSS.

Los tres iconos de `UserCard` (`lucide-react`) quedaron invisibles sobre la card oscura por
esto: `.actionBtn` no declaraba `color`. Antes de migrar la card a `#0a1020` el fondo era
blanco y el navy se leía bien, por lo que el bug solo apareció después de migrar la superficie.

**Regla derivada:** si un elemento es visible sobre una superficie oscura y no tiene color
propio, el problema es este, no el color del fondo.

### Trampa 3: `:root` y `.dark` declaran los mismos nombres con valores distintos

`--primary` significa `#115D8C` en `:root` y `#05DBF2` en `.dark`. Igual con `--text`,
`--muted`, `--border`, `--success`, `--danger`, `--ring`, `--grad-*` y `--nav-active-*`.

Leer un token sin saber **dónde** se resuelve es la raíz de la Trampa 1.

## Módulos ya migrados

### Referencia (oscuros antes de esta sesión)

Estos dos fijaron el estándar. **No fueron modificados el 2026-10-04.**

| Módulo | Archivos |
| :--- | :--- |
| Hoteles | `src/pages/HotelsPage.module.css`, `src/components/Hotel/HotelForm.module.css` |
| Mi perfil | `src/pages/UserProfilePage.module.css` |

### Migrados el 2026-10-04

| Módulo | Archivos |
| :--- | :--- |
| Perfiles | `src/components/Profile/ProfilesPage.module.css` |
| Usuarios | `src/pages/UsersPage.module.css`, `src/components/User/UserCard.module.css`, `src/components/User/UserForm.module.css` |

## Kit compartido ya disponible

`src/styles/globals.css` tiene el drawer y los botones ya migrados. **Preferir estas clases
antes de escribir valores nuevos** en un módulo:

| Clase | Uso |
| :--- | :--- |
| `.drawer-overlay` / `.drawer-panel` | overlay y panel lateral (`globals.css:8,17`) |
| `.drawer-header` / `.drawer-title` / `.drawer-close` | encabezado del drawer (`globals.css:41,50,56`) |
| `.drawer-body` / `.drawer-footer` | cuerpo y pie (`globals.css:71,80`) |
| `.btn-primary` | acción principal `#2563eb` (`globals.css:107`) |
| `.btn-ghost` | acción secundaria (`globals.css:125`) |
| `.btn-icon` / `.btn-icon-danger` | botones de icono (`globals.css:139`) |

`HotelForm.jsx` ya los usa. `UserForm.jsx` **no**, y por eso arrastra su propia paleta. Esa
refactorización está pendiente.

## Pendientes

- [ ] **Validar estos tokens contra `src/assets/PaletadeColores.png`.** Hasta entonces no
      afirmar que coinciden con la marca.
- [ ] Migrar `src/components/PermissionsPage/PermissionsPage.module.css` (sigue claro).
- [ ] Migrar Categorías, Ciudades, Países, Departamentos y Features.
- [ ] `/dashboard` no tiene ruta `index` (`App.jsx:54-145`). Entrar a esa URL pinta el shell
      con el `<Outlet />` vacío. Afecta a la navegación, no a los estilos.
- [ ] Evaluar añadir una ruta `index` a `/dashboard`.
- [ ] Migrar `UserForm` al kit de `globals.css` para eliminar la duplicación de tokens.

## Convenciones

| Convención | Detalle |
| :--- | :--- |
| Nombre de archivo | PascalCase: `PerfilesPage.module.css`. Debe coincidir con el del componente. |
| Documentos | Español, tablas Markdown, checklists con `- [ ]`. |
| Verificación | `npm run build` + `npm run lint`. Baseline de lint: **19 problemas** (16 errors, 3 warnings), todos preexistentes. |