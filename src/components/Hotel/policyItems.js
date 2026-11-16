// Helpers del PolicyEditor (separados para que el componente solo exporte componentes: fast refresh).

export const POLICY_TITLE_MAX = 100;
export const POLICY_DESC_MAX = 1000;

let seq = 0;

/** Ítem del editor con clave local: las políticas nuevas todavía no tienen polSec. */
export const toPolicyItem = (p = {}) => ({
  key: `pol-${++seq}`,
  polTitle: p.polTitle ?? p.title ?? "",
  polDescription: p.polDescription ?? p.description ?? "",
});
