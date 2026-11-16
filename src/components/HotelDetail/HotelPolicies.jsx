import { ShieldCheck } from "lucide-react";
import { listing } from "../../constants/listingData";
import styles from "./HotelPolicies.module.css";

/**
 * HU #26 — Bloque de políticas del producto.
 * Recibe `policies` del detalle del hotel ({ polSec, polTitle, polDescription });
 * si vienen vacías usa las genéricas de listingData.
 */
export const HotelPolicies = ({ policies }) => {
  const items =
    policies?.length > 0
      ? policies
      : listing.policies.map((p, i) => ({
          polSec: `fallback-${i}`,
          polTitle: p.title,
          polDescription: p.description,
        }));

  return (
    <section className={styles.policies} aria-labelledby="hotel-policies-title">
      <h2 id="hotel-policies-title" className={styles.title}>
        Políticas del alojamiento
      </h2>
      <div className={styles.grid}>
        {items.map((p) => (
          <article key={p.polSec} className={styles.card}>
            <div className={styles.cardHeader}>
              <ShieldCheck size={20} className={styles.icon} />
              <h3 className={styles.cardTitle}>{p.polTitle}</h3>
            </div>
            <p className={styles.cardDesc}>{p.polDescription}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
