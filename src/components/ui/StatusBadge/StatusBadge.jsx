/**
 * Badge de estado del panel (DESIGN.md → Badges). Usa las clases de admin-kit.css.
 * tone: "success" | "warning" | "danger" | "info" | "neutral"
 */
export const StatusBadge = ({ tone = "neutral", dot = false, children }) => (
  <span className={`sn-badge sn-badge--${tone}${dot ? " sn-badge--dot" : ""}`}>{children}</span>
);

export default StatusBadge;
