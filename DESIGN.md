# DESIGN.md — Sistema de diseño del panel admin (SweetNest)

Fuente de verdad visual del panel `/dashboard`. Los tokens viven en
`src/styles/tokens.css` (`--sn-*`) y el kit de botones y badges en `src/styles/admin-kit.css`.
Si cambias un valor, cámbialo **en los dos lados**: el CSS y este documento.

## Idea

**El nido.** Un sidebar navy de marca sostiene una **hoja clara** con la esquina redondeada:
el trabajo se apoya sobre el sidebar como una hoja sobre una mesa. Ese es el único gesto
llamativo; todo lo demás es callado, con mucho blanco y el color reservado para lo que importa.

Principios:
1. **El color significa algo.** Azul = la acción principal o el foco. Verde/ámbar/rojo = estados.
   Todo lo demás es navy, gris y blanco.
2. **Un solo botón primario por vista.** El resto son `secondary` o `ghost`.
3. **La jerarquía la marcan el peso y el tamaño, no la decoración.** Sin gradientes, sin sombras
   en cada card, sin etiquetas en mayúsculas con tracking.
4. **Texto útil.** Botones con verbo ("Guardar tipo", no "Enviar"), estados vacíos que invitan a
   actuar y errores que dicen qué pasó y cómo seguir.

## Paleta

Sale de la paleta oficial (`src/assets/PaletadeColores.png`).

| Rol | Token | Valor |
|---|---|---|
| Fondo de contenido (canvas) | `--sn-canvas` | `#f4f6fb` |
| Superficie (cards, header, tablas) | `--sn-surface` | `#ffffff` |
| Superficie hundida (filas hover, inputs readonly) | `--sn-surface-sunken` | `#f8fafc` |
| Borde | `--sn-border` | `#dce3ef` |
| Borde fuerte (hover de inputs/botones) | `--sn-border-strong` | `#c5d0e0` |
| Texto principal / títulos | `--sn-ink` | `#0f1f35` |
| Texto | `--sn-text` | `#3d5166` |
| Texto secundario | `--sn-text-soft` | `#7a8aa0` |
| Texto deshabilitado / placeholder | `--sn-text-muted` | `#b0bece` |
| Acción principal | `--sn-primary` / `--sn-primary-hover` | `#2b67f6` / `#1d55d8` |
| Fondo suave de acción | `--sn-primary-soft` | `#eaf0fe` |
| Anillo de foco | `--sn-ring` | `rgba(43,103,246,.12)` |

**Sidebar**

| Rol | Token | Valor |
|---|---|---|
| Fondo | `--sn-side-bg` | `#0f1f35` |
| Ítem activo | `--sn-side-raised` | `#1a3356` |
| Hover | `--sn-side-hover` | `rgba(255,255,255,.04)` |
| Divisores | `--sn-side-line` | `rgba(255,255,255,.07)` |
| Texto | `--sn-side-text` | `#b0bece` (≈ 9:1 sobre el fondo) |
| Texto activo | `--sn-side-strong` | `#ffffff` |
| Icono activo | `--sn-side-accent` | `#6b9fff` |

**Estados** (siempre en par: texto + fondo)

| Estado | Texto | Fondo | Uso |
|---|---|---|---|
| success | `#15803d` | `#e8f6ee` | Activo, confirmada |
| warning | `#b45309` | `#fdf3e2` | Pendiente |
| danger | `#e24b4b` | `#fdecec` | Cancelada, errores, borrar |
| info | `#1d55d8` | `#eaf0fe` | Completada, avisos |
| neutral | `#3d5166` | `#eef1f6` | Inactivo, sin dato |

## Tipografía

**Manrope** (Google Fonts, 400/500/600/700, se carga en `index.html`). Una sola familia.
En datos (precios, fechas, ids) usar `font-variant-numeric: tabular-nums`.

| Token | Tamaño | Uso |
|---|---|---|
| `--sn-text-xs` | 12px | Badges, etiquetas de grupo, metadatos |
| `--sn-text-sm` | 13px | Texto secundario, celdas densas |
| `--sn-text-base` | 14px | Texto base de la UI |
| `--sn-text-md` | 16px | Títulos de card, logo |
| `--sn-text-lg` | 20px | Título de página (header) |
| `--sn-text-xl` | 24px | Títulos de sección grandes |
| `--sn-text-2xl` | 30px | Números destacados (KPIs) |

Line-height 1.5 en texto y 1.25 en títulos. Pesos: 400 texto · 500 UI · 600 énfasis/botones · 700 títulos.
Títulos con `letter-spacing: -0.015em`. Mayúsculas solo en siglas.

## Espaciado, radios, sombras

**Espaciado** en base 4: `--sn-space-1…10` = 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64.
Padding del contenido: 32 (desktop) / 20×16 (móvil). Entre bloques de una página: 24.

| Radio | Valor | Uso |
|---|---|---|
| `--sn-radius-sm` | 6px | Badges cuadrados, ítems de menú contextual, botón icono |
| `--sn-radius-md` | 10px | Botones, inputs, ítems del sidebar |
| `--sn-radius-lg` | 14px | Cards, popovers, tablas |
| `--sn-radius-sheet` | 20px | Solo la hoja de contenido del shell |
| `--sn-radius-pill` | 999px | Badges de estado |

| Sombra | Valor | Uso |
|---|---|---|
| `--sn-shadow-xs` | `0 1px 2px rgba(15,31,53,.06)` | Botón secondary, inputs |
| `--sn-shadow-sm` | `0 2px 8px rgba(15,31,53,.06)` | Card en hover (no en reposo) |
| `--sn-shadow-lg` | `0 12px 32px rgba(15,31,53,.14)` | Popovers, menús, drawer |

Las cards en reposo usan **borde**, no sombra.

**Motion:** `--sn-ease` (`cubic-bezier(.2,.7,.2,1)`), `--sn-fast` 150ms, `--sn-slow` 240ms.
Con `prefers-reduced-motion` ambos valen 0. Solo hay animación cuando responde a una acción
(abrir, colapsar, confirmar).

## Botones — `admin-kit.css`

| Clase | Aspecto | Cuándo |
|---|---|---|
| `sn-btn sn-btn--primary` | Azul plano, texto blanco | La acción principal de la vista (una sola) |
| `sn-btn sn-btn--secondary` | Blanco, borde, texto ink | Acciones secundarias (Filtros, Exportar, Cancelar) |
| `sn-btn sn-btn--ghost` | Sin fondo ni borde | Acciones terciarias, en barras |
| `sn-btn sn-btn--danger` | Texto rojo, fondo suave al hover | Borrar / acciones destructivas |
| `sn-btn sn-btn--icon` | 32×32, icono gris | Acciones por fila (editar, borrar) con `aria-label` |
| `+ sn-btn--sm` | 32px de alto | En tablas y barras densas |

Alto 36px, radio md, peso 600, icono de 16px a la izquierda del texto.
Foco: `box-shadow: var(--sn-focus)` (anillo azul). Deshabilitado: opacidad .5.

## Badges — `admin-kit.css`

`<span class="sn-badge sn-badge--success sn-badge--dot">Activo</span>`

Pill, 12px/600, padding 2×10, par fg/bg del estado y punto opcional (`--dot`).

| Dato del backend | Variante | Texto |
|---|---|---|
| `state='A'` / `typState='A'` | success | Activo |
| `state='I'` | neutral | Inactivo |
| `PENDING` | warning | Pendiente |
| `CONFIRMED` | success | Confirmada |
| `CANCELLED` | danger | Cancelada |
| `COMPLETED` | info | Completada |
| `typMultiUnit='S'` | info | Varias unidades |

## Componentes — `src/components/ui/`

Primitivos del panel. Son presentacionales: los permisos (`hasActionPermission`) y el fetch los
resuelve la página que los usa. Referencia de uso: `TypesHotel/HotelTypeComponent.jsx`.

### `DataTable`

Toolbar (buscador · filtros · botón principal) + tabla en card + paginación, con estados de carga,
error y vacío.

```jsx
<DataTable
  columns={[{ key, header, render?, sortable?, sortValue?, numeric?, align?, width? }]}
  rows={rows} rowKey={(r) => r.id}
  loading={loading} error={error} onRetry={load}
  search={{ placeholder: "Buscar por nombre", keys: ["name"] }}
  filters={<select …/>} filtersActive={…} onClearFilters={…}
  primaryAction={canCreate ? { label: "Nuevo …", icon: Plus, onClick } : null}
  rowActions={(row) => [{ label: "Editar", icon: Pencil, onClick, hidden: !canUpdate },
                        { label: "Eliminar", icon: Trash2, onClick, tone: "danger", hidden: !canDelete }]}
  defaultSort={{ key: "name", dir: "asc" }} pageSize={10}
  emptyState={{ title, description }}
  pagination={{ page, total, onPageChange }}   // opcional: modo servidor
/>
```

- **Modo local** (por defecto): búsqueda sin distinguir mayúsculas ni tildes, orden y paginación en el cliente. Sirve para catálogos chicos.
- **Modo servidor** (`pagination`): la tabla no busca, no ordena ni corta; muestra `rows` tal cual. Para Hoteles.
- Los filtros son un slot: el padre filtra `rows` y avisa con `filtersActive`, para que el vacío diga
  "Ningún resultado con estos filtros" y no "Todavía no hay registros".
- Encabezados en sentence case, con `aria-sort` en las columnas ordenables. Las columnas `numeric` usan `tabular-nums`.
- Estados: skeleton de 5 filas (sin animación con movimiento reducido) · error con "Reintentar" · vacío con
  el botón principal · sin resultados con "Limpiar búsqueda".

### `IconButton`

`<IconButton icon={Pencil} label="Editar" tone="neutral|danger" tooltipAlign="center|end" />`.
Mide 32×32, es gris y en `danger` se pone rojo al hover. **El tooltip es propio** (aparece con hover tras 300ms y al instante con foco de teclado);
el `label` es a la vez `aria-label` y texto del tooltip. No usar `title`.

### `ConfirmDialog`

Sobre el `<dialog>` nativo (`showModal()`), que ya trae foco atrapado, Esc y backdrop sin dependencias.
Props: `open, title, description, confirmLabel, loadingLabel, tone, loading, error, onConfirm, onCancel`.
El foco inicial va a "Cancelar". Mientras `loading` no se puede cerrar. Si llega `error`, se muestra adentro y el modal
**sigue abierto** (por ejemplo, el 409 de "hay alojamientos que usan este tipo"). **Nunca usar `confirm()`/`alert()`** para esto.

### `StatusBadge`

`<StatusBadge tone="success" dot>Activo</StatusBadge>`: envoltorio de `sn-badge`. Mapeo en la sección Badges.

### `useConfirmDelete` (hook, junto a `ConfirmDialog`)

Junta el estado del flujo "eliminar con confirmación" (`target`, `loading`, `error`):

```jsx
const del = useConfirmDelete({
  onDelete: (row) => deleteX(row.id),
  onDone: load,
  conflictMessage: "No se puede eliminar: … Desactívalo en su lugar.",   // para el 409 (1017)
});
// en la fila: { label: "Eliminar", icon: Trash2, onClick: del.request, tone: "danger" }
<ConfirmDialog {...del.dialogProps} title={`¿Eliminar «${del.target?.name ?? ""}»?`} … />
```

Con un 409 muestra `conflictMessage`; con cualquier otro error, el mensaje del backend (`apiErrorMessage` de `Utils/apiError.js`).

### `FilterSelect` + `sn-select`

`<FilterSelect label="Filtrar por estado" allLabel="Todos los estados" value onChange options />`, con estilo `sn-select`
de `admin-kit.css`. En `ui/FilterSelect/options.js` están `STATE_OPTIONS` (A/I) y `optionsFrom(rows, getValue, getLabel)`,
que arma las opciones de un filtro por relación (país, departamento, ciudad, perfil) a partir de las filas.

### `ui/catalog.module.css`

Layout común de las páginas de catálogo: `page`, `intro` (línea descriptiva; el título lo pone el header del shell),
`name`, `muted`, `stack` + `stackSub` (celda de dos líneas), `empty` (—).
Cada módulo tiene su propio CSS solo para lo que es suyo (miniatura de Hoteles, avatar de Usuarios, icono de Características).

## Forms — crear y editar

**Un solo patrón: el panel lateral claro (`FormDrawer`).** Todos los crear/editar del panel se abren ahí
(antes había forms inline arriba de la tabla, un drawer oscuro y un modal propio). Así la lista queda a la vista.

### `FormDrawer` — `ui/FormDrawer/`

```jsx
{showForm && (
  <XForm key={editing?.id ?? "new"} initial={editing} onClose={closeForm} onSubmit={handleSubmit} />
)}
// dentro de XForm:
<FormDrawer title="Nuevo país" description="…" size="sm|md" submitLabel="Crear país"
            canSubmit={tienePermiso} onClose={onClose} onSubmit={submit}>…campos…</FormDrawer>
```

- Se abre al montarse (`<dialog>` + `showModal()`): foco atrapado, Esc, clic en el fondo para cerrar, y el foco va al primer campo.
- **Maneja el envío:** `submit` devuelve `false` si la validación falla (el form marca los campos). Si **lanza**, el error del
  backend aparece en un banner y el drawer no se cierra. Si sale bien, se cierra con animación y llama a `onClose`.
- Por eso el `handleSubmit` del padre **no** hace `alert` ni cierra el form: guarda, recarga y deja subir los errores.
- Los forms inicializan su estado **al montar** (sin `useEffect` que copie `initial`). El padre les pone `key` por registro.
- Tamaños: `sm` 440px (catálogos simples) y `md` 600px (Hotel). En **< 600px ocupa la pantalla completa**, con el pie
  fijo y los botones a todo el ancho.
- Animación: entra con un deslizamiento corto (32px + fade, 240ms) y sale con el movimiento inverso. Con reducir movimiento
  activado no hay animación y un timeout garantiza que igual se cierre.

### Primitivos — `ui/Form/`

| Componente | Uso |
|---|---|
| `Field` | Label, campo, hint y error. Render prop: `{(p) => <input {...p} className="sn-input" />}` (`p` = id + aria) |
| `FieldRow` | Dos campos en columnas; se apilan en móvil |
| `FormSection` | Grupo con título (forms largos: Hotel) |
| `Switch` | Activo/Inactivo (`role="switch"`). Trabaja con booleanos; el form traduce a `'A'`/`'I'` |
| `SegmentedControl` | 2–3 opciones excluyentes y cortas (Unidad única / Varias) |
| `ChipGroup` | Selección múltiple (categorías y características del hotel) |

Campos: `sn-input` (40px), `sn-textarea` y `sn-select sn-select--block`. Con `aria-invalid="true"` toman borde y anillo
danger. Los errores se escriben como una instrucción ("Escribe el nombre del país.", "Elige la ciudad."), nunca "Requerido".
Botón primario con verbo + objeto: "Crear país", "Guardar cambios".

## Detalles de interacción

- `sn-btn` se hunde a 0.98 al presionar. Inputs, chips, switch y segmented tienen transición de color, borde y sombra.
- Tabla: el hover pinta la fila con `--sn-canvas`. Las acciones quedan al 55% de opacidad y se encienden al pasar por la fila
  o con foco (solo con mouse; en táctil siempre visibles). La **columna de acciones es sticky** a la derecha.
- Móvil (< 600px): la toolbar se apila, los filtros quedan al 50% cada uno, el botón principal ocupa todo el ancho y la tabla
  hace scroll horizontal con las acciones fijas (con una sombra que indica que hay contenido debajo).
- Motion solo como respuesta a una acción del usuario. Sin animaciones de entrada por sección.

### Receta de una página de catálogo

1. `load()` con try/catch → `loading` (arranca en `true`) / `error`. Usar `unwrapList` si la respuesta puede venir envuelta.
2. Si la tabla necesita buscar u ordenar por un dato anidado, aplanarlo en `load` (por ejemplo `countryName`). **A los forms
   pasarles la fila tal como la espera el form**: algunos leen nombres de campo específicos.
3. Filtros en el padre (`rows = data.filter(…)`) + `filtersActive` / `onClearFilters`.
4. `primaryAction` y `rowActions` según `hasActionPermission(MODULES.X, ACTIONS.*)`.
5. `useConfirmDelete` + `ConfirmDialog`. Nunca `confirm()`/`alert()` para borrar.
6. Crear/editar en un `XForm` que renderiza `FormDrawer` (ver Forms). Nunca `alert()` para validar.

## Layout del shell — `components/layout/Dashboard/`

```
┌────────────┬─────────────────────────────────────────┐
│ [S] Sweet… │╭────────────────────────────────────────│
│            ││ ⫷  Título de la página     [acciones]  │  header 64px, blanco
│ Grupo      ││────────────────────────────────────────│
│  ▣ Ítem    ││                                         │
│  ▣ Activo  ││   <Outlet />   canvas #f4f6fb, pad 32   │
│            ││                                         │
│ ( CR ) Cr… ││                                         │
└────────────┴─────────────────────────────────────────┘
 navy 248px    hoja: margen 8px, radio 20px, scroll interno
```

- **Sidebar:** 248px / 72px colapsado (se guarda en `localStorage` `sn.sidebar.collapsed`). Grupos
  por `moduleName` con etiqueta en sentence case; colapsado, la etiqueta pasa a ser una línea divisoria y los
  ítems muestran el nombre en `title`. Abajo, la cuenta: avatar + nombre + rol, con un popover que tiene
  "Mi perfil" y "Cerrar sesión".
- **Header:** botón para colapsar, título derivado de la ruta (nombre del submódulo; fallback en
  `FALLBACK_TITLES` de `Dashboard.jsx`) y un slot `headerActions` reservado.
- **< 900px:** el sidebar pasa a off-canvas con scrim y la hoja ocupa la pantalla sin margen ni radio.
  Se cierra al navegar, con Esc o tocando el scrim.

## Reglas para CSS Modules nuevos

1. Colores, radios, sombras y espacios **siempre** con `var(--sn-*)`. Nada de hex sueltos.
2. La página no pinta su propio fondo: hereda el canvas de la hoja.
3. Cards = superficie blanca + borde `--sn-border` + `--sn-radius-lg`. La sombra va solo en hover, y solo si la card es clickeable.
4. Todo lo interactivo tiene foco visible (`--sn-focus`).
5. No inventar colores de módulo. Si falta un tono, se agrega acá y en `tokens.css`.

## Migración (estado actual)

- ✅ Shell (sidebar + header) migrado al sistema nuevo.
- ✅ Listados con `DataTable` + `ConfirmDialog`: Tipos, Países, Departamentos, Ciudades, Categorías,
  Características, Usuarios y Hoteles.
- ✅ Forms de crear/editar de los 8 catálogos en `FormDrawer`. Se borraron los CSS viejos de forms y las clases
  `drawer-*`, `form-section*` y `.btn-*` de `globals.css`.
- ⬜ Perfiles, Permisos y Mi perfil siguen con el **tema oscuro viejo** (`docs/ui-palette.md`, `.dark`, `--shell-*`).
- ⬜ `globals.css` (drawer, `.btn-primary`, `.btn-ghost`, `.btn-icon`) sigue oscuro; se reemplaza
  por `sn-btn*` y un drawer claro en la última fase. Después se retiran `.dark`, `--shell-*` y `ui-palette.md`.
