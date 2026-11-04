import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { apiErrorMessage } from "../../../Utils/apiError";
import styles from "./FormDrawer.module.css";

// Respaldo por si no llega animationend (reduced motion → duración 0, pestaña oculta, etc.)
const CLOSE_FALLBACK_MS = 320;

/**
 * Panel lateral para crear/editar (DESIGN.md → Forms). Se abre al montarse:
 *   {showForm && <FormDrawer title onClose onSubmit>…campos…</FormDrawer>}
 *
 * onSubmit: async () => false | void
 *   - devuelve false  → validación fallida (el form marca sus campos), no se cierra
 *   - lanza un error  → se muestra en el banner (mensaje del backend), no se cierra
 *   - otro            → se cierra con animación y llama a onClose
 */
export const FormDrawer = ({
  title,
  description,
  size = "sm",
  submitLabel = "Guardar",
  savingLabel = "Guardando…",
  cancelLabel = "Cancelar",
  canSubmit = true,
  onSubmit,
  onClose,
  children,
}) => {
  const ref = useRef(null);
  const bodyRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [closing, setClosing] = useState(false);
  const titleId = useId();
  const descId = useId();

  // Abrir al montar y llevar el foco al primer campo (no al botón ×)
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    bodyRef.current?.querySelector("input:not([type=hidden]), select, textarea")?.focus();
  }, []);

  // Cierre con animación: esperamos animationend; el timeout cubre reduced motion
  useEffect(() => {
    if (!closing) return undefined;
    const t = setTimeout(onClose, CLOSE_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [closing, onClose]);

  const requestClose = () => {
    if (!saving) setClosing(true);
  };

  const handleAnimationEnd = (e) => {
    if (closing && e.target === ref.current) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || closing) return;
    setError(null);
    setSaving(true);
    try {
      const result = await onSubmit?.();
      setSaving(false);
      if (result !== false) setClosing(true);
    } catch (err) {
      setSaving(false);
      setError(apiErrorMessage(err));
    }
  };

  return (
    <dialog
      ref={ref}
      className={`${styles.drawer} ${styles[size] ?? ""} ${closing ? styles.closing : ""}`}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => { e.preventDefault(); requestClose(); }}
      onClick={(e) => { if (e.target === ref.current) requestClose(); }}
      onAnimationEnd={handleAnimationEnd}
    >
      <form className={styles.panel} onSubmit={handleSubmit} noValidate>
        <header className={styles.header}>
          <div className={styles.headTexts}>
            <h2 id={titleId} className={styles.title}>{title}</h2>
            {description && <p id={descId} className={styles.description}>{description}</p>}
          </div>
          <button type="button" className={styles.close} onClick={requestClose} aria-label="Cerrar" disabled={saving}>
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div ref={bodyRef} className={styles.body}>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {children}
        </div>

        <footer className={styles.footer}>
          <button type="button" className="sn-btn sn-btn--secondary" onClick={requestClose} disabled={saving}>
            {cancelLabel}
          </button>
          {canSubmit && (
            <button type="submit" className="sn-btn sn-btn--primary" disabled={saving}>
              {saving ? savingLabel : submitLabel}
            </button>
          )}
        </footer>
      </form>
    </dialog>
  );
};

export default FormDrawer;
