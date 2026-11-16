import { useRef } from "react";
import { ArrowDown, ArrowUp, Plus, ScrollText, Trash2 } from "lucide-react";
import { listing } from "../../constants/listingData";
import { Field } from "../ui/Form/Form";
import { POLICY_DESC_MAX, POLICY_TITLE_MAX, toPolicyItem } from "./policyItems";
import styles from "./PolicyEditor.module.css";

/**
 * Lista editable de políticas del hotel (HU #26). Controlado: value = [{ key, polTitle, polDescription }].
 * El orden de la lista es el orden en que se muestran en el detalle (polOrder en el backend).
 * Se guarda junto con el hotel, por eso borrar no pide confirmación.
 */
export const PolicyEditor = ({ value, onChange, errors = [] }) => {
  // Al agregar una política, el foco va a su título apenas el input se monta
  const pendingFocus = useRef(null);
  const focusIfPending = (key) => (el) => {
    if (el && pendingFocus.current === key) {
      el.focus();
      pendingFocus.current = null;
    }
  };

  const update = (key, field, text) =>
    onChange(value.map((p) => (p.key === key ? { ...p, [field]: text } : p)));

  const add = () => {
    const item = toPolicyItem();
    pendingFocus.current = item.key;
    onChange([...value, item]);
  };

  const remove = (key) => onChange(value.filter((p) => p.key !== key));

  const move = (index, delta) => {
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  const applySuggested = () => {
    const items = listing.policies.map(toPolicyItem);
    pendingFocus.current = items[0]?.key ?? null;
    onChange(items);
  };

  if (value.length === 0) {
    return (
      <div className={styles.empty}>
        <ScrollText size={22} strokeWidth={1.75} aria-hidden="true" />
        <p className={styles.emptyTitle}>Este hotel todavía no tiene políticas.</p>
        <p className={styles.emptyHint}>
          Cuéntales a los huéspedes los horarios, cuidados y precauciones. Puedes partir de las sugeridas y ajustarlas.
        </p>
        <div className={styles.emptyActions}>
          <button type="button" className="sn-btn sn-btn--secondary sn-btn--sm" onClick={applySuggested}>
            Usar políticas sugeridas
          </button>
          <button type="button" className="sn-btn sn-btn--ghost sn-btn--sm" onClick={add}>
            <Plus size={16} aria-hidden="true" />
            Escribir una desde cero
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      <ol className={styles.list}>
        {value.map((p, i) => {
          const n = i + 1;
          const err = errors[i] ?? {};
          return (
            <li key={p.key} className={styles.item}>
              <div className={styles.itemHead}>
                <span className={styles.itemNumber} aria-hidden="true">{n}</span>
                <span className={styles.itemName}>{p.polTitle.trim() || "Política sin título"}</span>
                <div className={styles.itemActions}>
                  <button type="button" className="sn-btn sn-btn--icon" onClick={() => move(i, -1)}
                    disabled={i === 0} aria-label={`Subir política ${n}`}>
                    <ArrowUp size={16} aria-hidden="true" />
                  </button>
                  <button type="button" className="sn-btn sn-btn--icon" onClick={() => move(i, 1)}
                    disabled={i === value.length - 1} aria-label={`Bajar política ${n}`}>
                    <ArrowDown size={16} aria-hidden="true" />
                  </button>
                  <button type="button" className={`sn-btn sn-btn--icon ${styles.delete}`} onClick={() => remove(p.key)}
                    aria-label={`Quitar política ${n}`}>
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <Field label="Título" required error={err.polTitle}>
                {(fp) => (
                  <input {...fp} ref={focusIfPending(p.key)}
                    className="sn-input" value={p.polTitle} maxLength={POLICY_TITLE_MAX}
                    placeholder="Ej. Check-in y check-out"
                    onChange={(e) => update(p.key, "polTitle", e.target.value)} />
                )}
              </Field>

              <Field label="Descripción" required error={err.polDescription}
                hint={`${p.polDescription.length} / ${POLICY_DESC_MAX}`}>
                {(fp) => (
                  <textarea {...fp} className="sn-textarea" rows={3} value={p.polDescription}
                    maxLength={POLICY_DESC_MAX}
                    placeholder="Qué debe saber el huésped: horarios, qué está permitido y qué no…"
                    onChange={(e) => update(p.key, "polDescription", e.target.value)} />
                )}
              </Field>
            </li>
          );
        })}
      </ol>

      <button type="button" className={`sn-btn sn-btn--secondary ${styles.addBtn}`} onClick={add}>
        <Plus size={16} aria-hidden="true" />
        Agregar política
      </button>
    </div>
  );
};

export default PolicyEditor;
