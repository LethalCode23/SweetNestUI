import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, Minus, Plus, CheckCircle2, Clock } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { esES } from "@mui/x-date-pickers/locales";
import { formatCOP } from "../../constants/listingData";
import { getUnavailableDates, getUnits, getAvailableUnits } from "../../services/hotelServices/hotelService";
import { createReservation } from "../../services/reservationServices/reservationService";
import { useAuth } from "../../context/AuthContext";
import { formatRating, ratingCountLabel } from "../../Utils/rating";
import { BookingDay, CalendarLegend } from "./BookingDay";
import styles from "./BookingCard.module.css";

const ISO = "YYYY-MM-DD";
const pickerLocaleText = esES.components.MuiLocalizationProvider.defaultProps.localeText;
const draftKey = (hotSec) => `sn.pendingBooking.${hotSec}`;

// Mensajes propios para los códigos de negocio del backend (si no, se usa el message que manda)
const ERROR_BY_CODE = {
  1011: "Esa unidad ya está reservada en esas fechas. Actualizamos la disponibilidad: elige otras fechas u otra unidad.",
  1013: "Son más huéspedes de los que admite la unidad.",
  1014: "La fecha de salida debe ser posterior a la de llegada.",
  1015: "La fecha de llegada no puede estar en el pasado.",
};

// Un rango es válido si ninguna noche (checkIn … día anterior a checkOut) está bloqueada.
// El checkOut sí puede ser un día bloqueado: ese día entra otro huésped. Ver docs/calendario-fechas-ocupadas.md.
const isRangeFree = (checkIn, checkOut, blocked) => {
  for (let d = checkIn; d.isBefore(checkOut, "day"); d = d.add(1, "day")) {
    if (blocked.has(d.format(ISO))) return false;
  }
  return true;
};

// Borrador guardado antes de mandar al login (vuelve con las fechas, la unidad y los huéspedes)
const readDraft = (hotSec) => {
  try {
    const raw = sessionStorage.getItem(draftKey(hotSec));
    if (!raw) return null;
    sessionStorage.removeItem(draftKey(hotSec));
    const d = JSON.parse(raw);
    const checkIn = d.checkIn ? dayjs(d.checkIn) : null;
    // Si la llegada ya pasó, el borrador no sirve
    if (!checkIn?.isValid() || checkIn.isBefore(dayjs(), "day")) return null;
    return { ...d, checkIn, checkOut: d.checkOut ? dayjs(d.checkOut) : null };
  } catch {
    return null;
  }
};

const longDate = (iso) => dayjs(iso).locale("es").format("D [de] MMMM YYYY");

const pickerSlots = { day: BookingDay, actionBar: CalendarLegend };

export const BookingCard = ({ hotSec, rating }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // El borrador se lee una sola vez al montar
  const [draft] = useState(() => readDraft(hotSec));

  const [checkIn, setCheckIn] = useState(draft?.checkIn ?? null);
  const [checkOut, setCheckOut] = useState(draft?.checkOut ?? null);
  const [guests, setGuests] = useState(draft?.guests ?? 1);
  const [selectedUnitId, setSelectedUnitId] = useState(draft?.unitId ?? null);

  const [unavailable, setUnavailable] = useState([]); // ISO ordenado, como lo manda el backend
  const [totalUnits, setTotalUnits] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [units, setUnits] = useState([]); // todas las activas (para "desde $X" y capacidad)
  const [available, setAvailable] = useState(null); // libres en el rango elegido (null = sin rango)
  const [availableLoading, setAvailableLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // sube tras un 409 o "Hacer otra reserva"

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  // Fechas ocupadas + unidades del hotel
  useEffect(() => {
    if (!hotSec) return undefined;
    const controller = new AbortController();
    const { signal } = controller;

    getUnavailableDates(hotSec, { signal })
      .then((data) => {
        setUnavailable(data?.unavailableDates ?? []);
        setTotalUnits(data?.totalUnits ?? null);
        setLoadError(null);
      })
      .catch((err) => {
        if (signal.aborted) return;
        // Sin datos el calendario sigue usable; la validación final la hace el backend al reservar.
        setUnavailable([]);
        setLoadError(err.response?.data?.message ?? "No se pudieron cargar las fechas ocupadas.");
      });

    getUnits(hotSec, { signal })
      .then(setUnits)
      .catch(() => {
        if (!signal.aborted) setUnits([]);
      });

    return () => controller.abort();
  }, [hotSec, refreshKey]);

  const blocked = useMemo(() => new Set(unavailable), [unavailable]);

  const hasRange = checkIn?.isValid() && checkOut?.isValid() && checkOut.isAfter(checkIn, "day");
  const rangeFree = hasRange && isRangeFree(checkIn, checkOut, blocked);
  const noUnits = totalUnits === 0;
  const checkInIso = hasRange ? checkIn.format(ISO) : null;
  const checkOutIso = hasRange ? checkOut.format(ISO) : null;

  // Unidades libres del rango elegido
  useEffect(() => {
    if (!hotSec || !rangeFree) {
      setAvailable(null);
      return undefined;
    }
    const controller = new AbortController();
    setAvailableLoading(true);
    getAvailableUnits(hotSec, checkInIso, checkOutIso, { signal: controller.signal })
      .then((list) => {
        setAvailable(list);
        // Si la unidad elegida ya no está libre (o hay una sola), se ajusta la selección
        setSelectedUnitId((current) => {
          if (list.some((u) => u.uniSec === current)) return current;
          return list.length === 1 ? list[0].uniSec : null;
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setAvailable([]);
        setSubmitError(err.response?.data?.message ?? "No se pudo consultar la disponibilidad.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setAvailableLoading(false);
      });
    return () => controller.abort();
  }, [hotSec, rangeFree, checkInIso, checkOutIso, refreshKey]);

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
    setSubmitError(null);
    if (
      checkOut &&
      value?.isValid() &&
      (!checkOut.isAfter(value, "day") || !isRangeFree(value, checkOut, blocked))
    ) {
      setCheckOut(null);
    }
  };

  const handleCheckOut = (value) => {
    setCheckOut(value);
    setSubmitError(null);
  };

  // Unidad elegida (solo entre las libres del rango) y precios reales
  const selectedUnit = available?.find((u) => u.uniSec === selectedUnitId) ?? null;
  const minPrice = units.length ? Math.min(...units.map((u) => u.uniPrice)) : null;
  const maxGuests = selectedUnit?.uniCapacity ?? (units.length ? Math.max(...units.map((u) => u.uniCapacity)) : 1);
  const safeGuests = Math.min(Math.max(guests, 1), maxGuests);
  const nights = hasRange ? checkOut.diff(checkIn, "day") : 0;
  const total = selectedUnit && nights ? selectedUnit.uniPrice * nights : null;

  const noneFree = rangeFree && !availableLoading && available?.length === 0;
  const needsUnitChoice = rangeFree && (available?.length ?? 0) > 1;
  const canReserve = rangeFree && Boolean(selectedUnit) && !availableLoading && !submitting && !noUnits;

  const handleReserve = async () => {
    if (!canReserve) return;
    const payload = { unitId: selectedUnit.uniSec, checkIn: checkInIso, checkOut: checkOutIso, guests: safeGuests };

    // Sin sesión: guardar el borrador, ir al login y volver acá con todo elegido
    if (!user) {
      try {
        sessionStorage.setItem(draftKey(hotSec), JSON.stringify(payload));
      } catch {
        /* sin storage: el usuario vuelve y elige de nuevo */
      }
      navigate("/login", { state: { from: location } });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      setResult(await createReservation(payload));
    } catch (err) {
      const code = err.response?.data?.code;
      setSubmitError(ERROR_BY_CODE[code] ?? err.response?.data?.message ?? "No se pudo completar la reserva.");
      if (code === 1011) setRefreshKey((k) => k + 1); // alguien reservó antes: recargar disponibilidad
    } finally {
      setSubmitting(false);
    }
  };

  const startOver = () => {
    setResult(null);
    setCheckIn(null);
    setCheckOut(null);
    setSelectedUnitId(null);
    setGuests(1);
    setSubmitError(null);
    setRefreshKey((k) => k + 1);
  };

  const ratingMini = (
    <div className={styles.ratingMini}>
      <Star size={14} className={styles.starFilled} />
      {rating?.ratingCount > 0 ? (
        <>
          <span className={styles.ratingValue}>{formatRating(rating.ratingAvg)}</span>
          <span className={styles.ratingCount}>· {ratingCountLabel(rating.ratingCount)}</span>
        </>
      ) : (
        <span className={styles.ratingCount}>Sin valoraciones</span>
      )}
    </div>
  );

  // ── Reserva hecha ─────────────────────────────────────────────────────
  if (result) {
    const confirmed = result.status === "CONFIRMED";
    const Icon = confirmed ? CheckCircle2 : Clock;
    return (
      <div className={styles.card}>
        <div className={styles.result} role="status" aria-live="polite">
          <Icon size={36} className={confirmed ? styles.resultIconOk : styles.resultIconPending} aria-hidden="true" />
          <h3 className={styles.resultTitle}>{confirmed ? "¡Reserva confirmada!" : "Reserva enviada"}</h3>
          <p className={styles.resultText}>
            {confirmed
              ? "Tu estadía quedó reservada."
              : "El anfitrión debe confirmarla. Te avisaremos cuando lo haga."}
          </p>
        </div>

        <dl className={styles.breakdown}>
          <div className={styles.breakdownRow}>
            <dt className={styles.resultLabel}>Unidad</dt>
            <dd className={styles.breakdownValue}>{result.unitName}</dd>
          </div>
          <div className={styles.breakdownRow}>
            <dt className={styles.resultLabel}>Llegada</dt>
            <dd className={styles.breakdownValue}>{longDate(result.checkIn)}</dd>
          </div>
          <div className={styles.breakdownRow}>
            <dt className={styles.resultLabel}>Salida</dt>
            <dd className={styles.breakdownValue}>{longDate(result.checkOut)}</dd>
          </div>
          <div className={styles.breakdownRow}>
            <dt className={styles.resultLabel}>Huéspedes</dt>
            <dd className={styles.breakdownValue}>{result.guests}</dd>
          </div>
          <div className={styles.breakdownRow}>
            <dt className={styles.resultLabel}>
              {formatCOP(result.pricePerNight)} x {result.nights} {result.nights === 1 ? "noche" : "noches"}
            </dt>
            <dd className={styles.breakdownValue}>{formatCOP(result.totalPrice)}</dd>
          </div>
        </dl>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>{formatCOP(result.totalPrice)}</span>
        </div>
        <p className={styles.taxNote}>Reserva #{result.resSec}</p>

        <button type="button" className={styles.secondaryBtn} onClick={startOver}>
          Hacer otra reserva
        </button>
      </div>
    );
  }

  // ── Formulario ────────────────────────────────────────────────────────
  let notice = submitError;
  if (!notice) {
    if (noUnits) notice = "Este alojamiento no tiene unidades disponibles.";
    else if (hasRange && !rangeFree) notice = "El rango elegido incluye noches ocupadas.";
    else if (noneFree) notice = "No quedan unidades libres en esas fechas. Prueba con otras.";
    else if (loadError) notice = loadError;
  }

  return (
    <div className={styles.card}>
      {/* Precio */}
      <div className={styles.priceHeader}>
        <p className={styles.currentPrice}>
          {selectedUnit ? (
            <>
              <span className={styles.priceValue}>{formatCOP(selectedUnit.uniPrice)}</span>
              <span className={styles.priceUnit}> / noche</span>
            </>
          ) : minPrice != null ? (
            <>
              <span className={styles.priceUnit}>Desde </span>
              <span className={styles.priceValue}>{formatCOP(minPrice)}</span>
              <span className={styles.priceUnit}> / noche</span>
            </>
          ) : (
            <span className={styles.priceUnit}>Elige las fechas para ver el precio</span>
          )}
        </p>
        {ratingMini}
      </div>

      {/* Fechas y huéspedes */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es" localeText={pickerLocaleText}>
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
                onChange={handleCheckOut}
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
              <span className={styles.fieldLabel} id="guests-label">Huéspedes</span>
              <span className={styles.guestValue} aria-live="polite">
                {safeGuests} {safeGuests === 1 ? "huésped" : "huéspedes"}
                <span className={styles.guestMax}> · máx. {maxGuests}</span>
              </span>
            </div>
            <div className={styles.stepper} role="group" aria-labelledby="guests-label">
              <button
                type="button"
                className={styles.stepBtn}
                aria-label="Quitar un huésped"
                disabled={safeGuests <= 1}
                onClick={() => setGuests(safeGuests - 1)}
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.stepBtn}
                aria-label="Agregar un huésped"
                disabled={safeGuests >= maxGuests}
                onClick={() => setGuests(safeGuests + 1)}
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        {unavailable.length > 0 && (
          <p className={styles.bookedHint}>
            <span className={styles.bookedHintSwatch} aria-hidden="true" />
            Los días tachados en rojo ya están reservados.
          </p>
        )}
      </LocalizationProvider>

      {/* Unidad: se elige solo si hay más de una libre en el rango */}
      {needsUnitChoice && (
        <fieldset className={styles.units}>
          <legend className={styles.unitsLegend}>Elige la unidad</legend>
          <div className={styles.unitList} role="radiogroup">
            {available.map((u) => {
              const on = u.uniSec === selectedUnitId;
              return (
                <label key={u.uniSec} className={`${styles.unitOption} ${on ? styles.unitOptionOn : ""}`}>
                  <input
                    type="radio"
                    name={`unit-${hotSec}`}
                    className={styles.unitRadio}
                    checked={on}
                    onChange={() => { setSelectedUnitId(u.uniSec); setSubmitError(null); }}
                  />
                  <span className={styles.unitText}>
                    <span className={styles.unitName}>{u.uniName}</span>
                    <span className={styles.unitMeta}>Hasta {u.uniCapacity} {u.uniCapacity === 1 ? "huésped" : "huéspedes"}</span>
                  </span>
                  <span className={styles.unitPrice}>{formatCOP(u.uniPrice)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
      {rangeFree && available?.length === 1 && selectedUnit && (
        <p className={styles.unitSingle}>Unidad: <strong>{selectedUnit.uniName}</strong></p>
      )}

      {notice && <p className={styles.notice} role="alert">{notice}</p>}

      <button type="button" className={styles.reserveBtn} disabled={!canReserve} onClick={handleReserve}>
        {submitting
          ? "Reservando…"
          : availableLoading
            ? "Consultando disponibilidad…"
            : needsUnitChoice && !selectedUnit
              ? "Elige una unidad"
              : "Reservar ahora"}
      </button>
      <p className={styles.noCharge}>
        {user
          ? "No se realizará ningún cargo en este momento."
          : "Te pediremos iniciar sesión y volverás aquí con tu selección."}
      </p>

      {/* Total real: noches × precio de la unidad (lo mismo que calcula el backend) */}
      {total != null && (
        <>
          <dl className={styles.breakdown}>
            <div className={styles.breakdownRow}>
              <dt className={styles.breakdownLabel}>
                {formatCOP(selectedUnit.uniPrice)} x {nights} {nights === 1 ? "noche" : "noches"}
              </dt>
              <dd className={styles.breakdownValue}>{formatCOP(total)}</dd>
            </div>
          </dl>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total (COP)</span>
            <span className={styles.totalValue}>{formatCOP(total)}</span>
          </div>
        </>
      )}
    </div>
  );
};
