import { useEffect, useMemo, useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { esES } from "@mui/x-date-pickers/locales";
import { listing, formatCOP } from "../../constants/listingData";
import { getUnavailableDates } from "../../services/hotelServices/hotelService";
import { BookingDay, CalendarLegend } from "./BookingDay";
import styles from "./BookingCard.module.css";

const ISO = "YYYY-MM-DD";
const pickerLocaleText = esES.components.MuiLocalizationProvider.defaultProps.localeText;

// Un rango es válido si ninguna noche (checkIn … día anterior a checkOut) está bloqueada.
// El checkOut sí puede ser un día bloqueado: ese día entra otro huésped. Ver docs/calendario-fechas-ocupadas.md.
const isRangeFree = (checkIn, checkOut, blocked) => {
  for (let d = checkIn; d.isBefore(checkOut, "day"); d = d.add(1, "day")) {
    if (blocked.has(d.format(ISO))) return false;
  }
  return true;
};

const pickerSlots = { day: BookingDay, actionBar: CalendarLegend };

export const BookingCard = ({ hotel, hotSec }) => {
  const { price, breakdown } = listing;

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [unavailable, setUnavailable] = useState([]); // ISO ordenado, como lo manda el backend
  const [totalUnits, setTotalUnits] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!hotSec) return undefined;
    const controller = new AbortController();
    getUnavailableDates(hotSec, { signal: controller.signal })
      .then((data) => {
        setUnavailable(data?.unavailableDates ?? []);
        setTotalUnits(data?.totalUnits ?? null);
        setLoadError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        // Sin datos el calendario sigue usable; la validación final la hace el backend al reservar.
        setUnavailable([]);
        setLoadError(
          err.response?.data?.message ?? "No se pudieron cargar las fechas ocupadas."
        );
      });
    return () => controller.abort();
  }, [hotSec]);

  const blocked = useMemo(() => new Set(unavailable), [unavailable]);

  // Primer día bloqueado después de la llegada: es la salida más tardía posible.
  const lastCheckOut = useMemo(() => {
    if (!checkIn) return null;
    const from = checkIn.format(ISO);
    const next = unavailable.find((iso) => iso > from);
    return next ? dayjs(next) : null;
  }, [checkIn, unavailable]);

  // Mismo aspecto en los dos calendarios: día personalizado, popover redondeado y leyenda abajo.
  const pickerSlotProps = useMemo(
    () => ({
      textField: { variant: "standard", size: "small", fullWidth: true },
      day: { blocked, checkIn, checkOut },
      desktopPaper: { className: styles.pickerPaper },
      mobilePaper: { className: styles.pickerPaper },
    }),
    [blocked, checkIn, checkOut]
  );

  const handleCheckIn = (value) => {
    setCheckIn(value);
    if (
      checkOut &&
      value?.isValid() &&
      (!checkOut.isAfter(value, "day") || !isRangeFree(value, checkOut, blocked))
    ) {
      setCheckOut(null);
    }
  };

  const hasRange = checkIn?.isValid() && checkOut?.isValid() && checkOut.isAfter(checkIn, "day");
  const rangeFree = hasRange && isRangeFree(checkIn, checkOut, blocked);
  const noUnits = totalUnits === 0;

  const nights = hasRange ? checkOut.diff(checkIn, "day") : breakdown.nights;
  const nightly = hotel?.cost ?? price.nightly;
  const nightsTotal = nightly * nights;
  const total =
    nightsTotal + breakdown.cleaning + breakdown.service - breakdown.earlyBirdDiscount;

  let notice = null;
  if (noUnits) notice = "Este alojamiento no tiene unidades disponibles.";
  else if (hasRange && !rangeFree) notice = "El rango elegido incluye noches ocupadas.";
  else if (loadError) notice = loadError;

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
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="es"
        localeText={pickerLocaleText}
      >
        <div className={styles.selectors}>
          <div className={styles.dateRow}>
            <div className={styles.dateField}>
              <span className={styles.fieldLabel}>Llegada</span>
              <DatePicker
                value={checkIn}
                onChange={handleCheckIn}
                disablePast
                disabled={noUnits}
                shouldDisableDate={(day) => blocked.has(day.format(ISO))}
                slots={pickerSlots}
                slotProps={pickerSlotProps}
              />
            </div>
            <div className={styles.dateField}>
              <span className={styles.fieldLabel}>Salida</span>
              <DatePicker
                value={checkOut}
                onChange={setCheckOut}
                disablePast
                disabled={noUnits || !checkIn?.isValid()}
                minDate={checkIn?.isValid() ? checkIn.add(1, "day") : undefined}
                maxDate={lastCheckOut ?? undefined}
                slots={pickerSlots}
                slotProps={pickerSlotProps}
              />
            </div>
          </div>
          <div className={styles.guestRow}>
            <div className={styles.guestInfo}>
              <span className={styles.fieldLabel}>Huéspedes</span>
              <span className={styles.guestValue}>1 adulto (capacidad máx. 2)</span>
            </div>
            <ChevronDown size={16} className={styles.chevron} />
          </div>
        </div>
        {unavailable.length > 0 && (
          <p className={styles.bookedHint}>
            <span className={styles.bookedHintSwatch} aria-hidden="true" />
            Los días tachados en rojo ya están reservados.
          </p>
        )}
      </LocalizationProvider>

      {notice && <p className={styles.notice}>{notice}</p>}

      {/* Reserve button */}
      <button className={styles.reserveBtn} disabled={noUnits || !rangeFree}>
        Reservar ahora
      </button>
      <p className={styles.noCharge}>
        No se realizará ningún cargo en este momento. Las fechas son orientativas; la
        disponibilidad se confirma al reservar.
      </p>

      {/* Breakdown */}
      <dl className={styles.breakdown}>
        <div className={styles.breakdownRow}>
          <dt className={styles.breakdownLabel}>
            {formatCOP(nightly)} x {nights} {nights === 1 ? "noche" : "noches"}
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
