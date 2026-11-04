import { useId } from "react";
import { Check } from "lucide-react";
import styles from "./Form.module.css";

/**
 * Primitivos de formulario del panel (DESIGN.md → Forms).
 *
 *   <Field label="Nombre" error={errors.name} hint="Máximo 50 caracteres">
 *     {(p) => <input {...p} className="sn-input" value={…} onChange={…} />}
 *   </Field>
 *
 * `p` trae id, aria-invalid y aria-describedby ya conectados con el label, el hint y el error.
 */
export const Field = ({ label, hint, error, required = false, children }) => {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`${styles.field} ${error ? styles.hasError : ""}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {error ? (
        <p id={errorId} className={styles.error}>{error}</p>
      ) : (
        hint && <p id={hintId} className={styles.hint}>{hint}</p>
      )}
    </div>
  );
};

/** Dos campos lado a lado que se apilan en móvil. */
export const FieldRow = ({ children }) => <div className={styles.row}>{children}</div>;

/** Grupo de campos con un título corto (forms largos). */
export const FormSection = ({ title, description, children }) => (
  <section className={styles.section}>
    <div className={styles.sectionHead}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {description && <p className={styles.sectionDesc}>{description}</p>}
    </div>
    {children}
  </section>
);

/**
 * Interruptor accesible (role="switch") con título y descripción.
 *   <Switch checked={on} onChange={setOn} label="Activo" description="Visible en la búsqueda" />
 */
export const Switch = ({ checked, onChange, label, description, disabled = false }) => {
  const id = useId();
  return (
    <div className={styles.switchRow}>
      <div className={styles.switchTexts}>
        <label htmlFor={id} className={styles.switchLabel}>{label}</label>
        {description && <p className={styles.switchDesc}>{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`${styles.switch} ${checked ? styles.switchOn : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.switchThumb} aria-hidden="true" />
      </button>
    </div>
  );
};

/**
 * Opciones excluyentes en botones (2–3 opciones cortas).
 *   <SegmentedControl label="Unidades" value={v} onChange={setV}
 *                     options={[{ value: "N", label: "Única" }, { value: "S", label: "Varias" }]} />
 */
export const SegmentedControl = ({ label, value, onChange, options, hint }) => {
  const id = useId();
  return (
    <div className={styles.field}>
      <span id={id} className={styles.label}>{label}</span>
      <div className={styles.segmented} role="radiogroup" aria-labelledby={id}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            className={`${styles.segment} ${value === o.value ? styles.segmentOn : ""}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
};

/**
 * Selección múltiple con chips.
 *   <ChipGroup label="Categorías" options={[{ value: 1, label: "Playa" }]} selected={[1]} onToggle={toggle} />
 */
export const ChipGroup = ({ label, options, selected, onToggle, emptyText = "No hay opciones disponibles." }) => {
  const id = useId();
  return (
    <div className={styles.field}>
      <span id={id} className={styles.label}>{label}</span>
      {options.length === 0 ? (
        <p className={styles.hint}>{emptyText}</p>
      ) : (
        <div className={styles.chips} role="group" aria-labelledby={id}>
          {options.map((o) => {
            const on = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={on}
                className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                onClick={() => onToggle(o.value)}
              >
                <span className={styles.chipCheck} aria-hidden="true">
                  <Check size={12} strokeWidth={3} />
                </span>
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
