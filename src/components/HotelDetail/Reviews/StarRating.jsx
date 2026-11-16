import { Star } from "lucide-react";
import { formatRating } from "../../../Utils/rating";
import styles from "./StarRating.module.css";

/**
 * Estrellas de solo lectura. Admite decimales: cada estrella se rellena en proporción (4,6 → 4 llenas + 60%).
 * <StarRating value={4.6} size={18} />
 */
export const StarRating = ({ value = 0, size = 16 }) => {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span className={styles.stars} role="img" aria-label={`${formatRating(v)} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, v - i)) * 100;
        return (
          <span key={i} className={styles.star} style={{ width: size, height: size }} aria-hidden="true">
            <Star size={size} className={styles.empty} strokeWidth={1.75} />
            <span className={styles.fillClip} style={{ width: `${fill}%` }}>
              <Star size={size} className={styles.full} strokeWidth={1.75} />
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default StarRating;
