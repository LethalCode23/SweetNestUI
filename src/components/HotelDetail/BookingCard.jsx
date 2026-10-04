import { Star, ChevronDown } from "lucide-react";
import { listing, formatCOP } from "../../constants/listingData";
import styles from "./BookingCard.module.css";

export const BookingCard = ({ hotel }) => {
  const { price, breakdown } = listing;
  const nightly = hotel?.cost ?? price.nightly;
  const nightsTotal = nightly * breakdown.nights;
  const total =
    nightsTotal + breakdown.cleaning + breakdown.service - breakdown.earlyBirdDiscount;

  return (
    <div className={styles.card}>
      {/* Price header */}
      <div className={styles.priceHeader}>
        <div>
          <div className={styles.priceRow}>
            <span className={styles.originalPrice}>{formatCOP(price.original)}</span>
            <span className={styles.discountBadge}>
              {price.discountPercent}% DESCUENTO
            </span>
          </div>
          <p className={styles.currentPrice}>
            <span className={styles.priceValue}>{formatCOP(nightly)}</span>
            <span className={styles.priceUnit}> / noche</span>
          </p>
        </div>
        <div className={styles.ratingMini}>
          <Star size={14} className={styles.starFilled} />
          <span className={styles.ratingValue}>{listing.rating}</span>
          <span className={styles.ratingCount}>· {listing.reviews} reseñas</span>
        </div>
      </div>

      {/* Date & guest selectors */}
      <div className={styles.selectors}>
        <div className={styles.dateRow}>
          <label className={styles.dateField}>
            <span className={styles.fieldLabel}>Llegada</span>
            <input
              type="date"
              defaultValue="2026-09-18"
              className={styles.dateInput}
            />
          </label>
          <label className={styles.dateField}>
            <span className={styles.fieldLabel}>Salida</span>
            <input
              type="date"
              defaultValue="2026-09-20"
              className={styles.dateInput}
            />
          </label>
        </div>
        <div className={styles.guestRow}>
          <div className={styles.guestInfo}>
            <span className={styles.fieldLabel}>Huéspedes</span>
            <span className={styles.guestValue}>1 adulto (capacidad máx. 2)</span>
          </div>
          <ChevronDown size={16} className={styles.chevron} />
        </div>
      </div>

      {/* Reserve button */}
      <button className={styles.reserveBtn}>Reservar ahora</button>
      <p className={styles.noCharge}>No se realizará ningún cargo en este momento</p>

      {/* Breakdown */}
      <dl className={styles.breakdown}>
        <div className={styles.breakdownRow}>
          <dt className={styles.breakdownLabel}>
            {formatCOP(nightly)} x {breakdown.nights} noches
          </dt>
          <dd className={styles.breakdownValue}>{formatCOP(nightsTotal)}</dd>
        </div>
        <div className={styles.breakdownRow}>
          <dt className={styles.breakdownLabel}>Tarifa de limpieza profesional</dt>
          <dd className={styles.breakdownValue}>{formatCOP(breakdown.cleaning)}</dd>
        </div>
        <div className={styles.breakdownRow}>
          <dt className={styles.breakdownLabel}>Tarifa de servicio SweetNest</dt>
          <dd className={styles.breakdownValue}>{formatCOP(breakdown.service)}</dd>
        </div>
        <div className={`${styles.breakdownRow} ${styles.discountRow}`}>
          <dt>Descuento por reserva anticipada</dt>
          <dd>-{formatCOP(breakdown.earlyBirdDiscount)}</dd>
        </div>
      </dl>

      {/* Total */}
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total estimado (COP)</span>
        <span className={styles.totalValue}>{formatCOP(total)}</span>
      </div>
      <p className={styles.taxNote}>Precios con impuestos incluidos</p>
    </div>
  );
};
