import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import styles from "./ConfirmDialog.module.css";

/**
 * Modal de confirmación sobre <dialog> nativo (foco atrapado, Esc y backdrop gratis).
 * Mientras `loading`, no se puede cerrar. Si llega `error`, se muestra adentro y el modal sigue abierto.
 */
export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Eliminar",
  loadingLabel = "Eliminando…",
  cancelLabel = "Cancelar",
  tone = "danger",
  loading = false,
  error = null,
  onConfirm,
  onCancel,
}) => {
  const ref = useRef(null);
  const cancelRef = useRef(null);

  // Sincroniza la prop `open` con el estado del <dialog>
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Esc dispara "cancel": lo controlamos nosotros para respetar `loading`
  const handleCancelEvent = (e) => {
    e.preventDefault();
    if (!loading) onCancel?.();
  };

  // Click en el backdrop (el target es el propio <dialog>)
  const handleClick = (e) => {
    if (e.target === ref.current && !loading) onCancel?.();
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onCancel={handleCancelEvent}
      onClick={handleClick}
      aria-labelledby="sn-confirm-title"
      aria-describedby="sn-confirm-desc"
    >
      <div className={styles.body}>
        <span className={`${styles.icon} ${tone === "danger" ? styles.iconDanger : ""}`} aria-hidden="true">
          <AlertTriangle size={20} strokeWidth={1.75} />
        </span>
        <div className={styles.texts}>
          <h2 id="sn-confirm-title" className={styles.title}>{title}</h2>
          {description && <p id="sn-confirm-desc" className={styles.description}>{description}</p>}
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          ref={cancelRef}
          type="button"
          className="sn-btn sn-btn--secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`sn-btn ${tone === "danger" ? styles.confirmDanger : "sn-btn--primary"}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? loadingLabel : confirmLabel}
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
