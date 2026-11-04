import { useId } from "react";
import styles from "./IconButton.module.css";

/**
 * Botón de solo icono con tooltip propio (hover y foco de teclado).
 * El label se usa como aria-label y como texto del tooltip.
 * tone: "neutral" | "danger" · tooltipAlign: "center" | "end" (usar "end" pegado al borde derecho)
 */
export const IconButton = ({
  icon,
  label,
  onClick,
  tone = "neutral",
  disabled = false,
  type = "button",
  tooltipAlign = "center",
}) => {
  const tipId = useId();
  const Icon = icon;

  return (
    <span className={styles.wrap}>
      <button
        type={type}
        className={`${styles.btn} ${tone === "danger" ? styles.danger : ""}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-describedby={tipId}
      >
        <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <span id={tipId} role="tooltip" className={`${styles.tip} ${tooltipAlign === "end" ? styles.tipEnd : ""}`}>
        {label}
      </span>
    </span>
  );
};

export default IconButton;
