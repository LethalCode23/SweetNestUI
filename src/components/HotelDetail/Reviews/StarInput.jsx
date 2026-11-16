import { useId, useRef, useState } from "react";
import { Star } from "lucide-react";
import { STAR_LABELS } from "../../../Utils/rating";
import styles from "./StarInput.module.css";

/**
 * Selector de 1 a 5 estrellas accesible (radiogroup):
 * clic, flechas izquierda/derecha (o arriba/abajo), Inicio/Fin. Al pasar el mouse muestra una vista previa.
 * <StarInput value={stars} onChange={setStars} error="Elige de 1 a 5 estrellas." />
 */
export const StarInput = ({ value = 0, onChange, label = "Tu valoración", error }) => {
  const [hover, setHover] = useState(0);
  const refs = useRef([]);
  const labelId = useId();
  const errorId = useId();
  const shown = hover || value;

  const select = (n) => {
    onChange(n);
    refs.current[n - 1]?.focus();
  };

  const onKeyDown = (e) => {
    const current = value || 0;
    const keys = {
      ArrowRight: Math.min(5, current + 1),
      ArrowUp: Math.min(5, current + 1),
      ArrowLeft: Math.max(1, current - 1),
      ArrowDown: Math.max(1, current - 1),
      Home: 1,
      End: 5,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key]);
    }
  };

  return (
    <div className={styles.field}>
      <span id={labelId} className={styles.label}>{label}</span>
      <div className={styles.row}>
        <div
          className={styles.group}
          role="radiogroup"
          aria-labelledby={labelId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              ref={(el) => (refs.current[n - 1] = el)}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}: ${STAR_LABELS[n - 1]}`}
              // Roving tabindex: solo la elegida (o la primera) entra en el orden de tabulación
              tabIndex={(value || 1) === n ? 0 : -1}
              className={`${styles.star} ${n <= shown ? styles.on : ""}`}
              onClick={() => select(n)}
              onMouseEnter={() => setHover(n)}
              onKeyDown={onKeyDown}
            >
              <Star size={30} strokeWidth={1.6} aria-hidden="true" />
            </button>
          ))}
        </div>
        <span className={styles.caption} aria-hidden="true">
          {shown ? STAR_LABELS[shown - 1] : "Sin elegir"}
        </span>
      </div>
      {error && <p id={errorId} className={styles.error}>{error}</p>}
    </div>
  );
};

export default StarInput;
