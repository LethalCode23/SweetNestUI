import { PickerDay } from "@mui/x-date-pickers/PickerDay";
import { usePickerActionsContext, usePickerContext } from "@mui/x-date-pickers/hooks";
import styles from "./BookingCard.module.css";

const ISO = "YYYY-MM-DD";

// Día del calendario de Llegada/Salida (slot `day`). Marca las fechas ya reservadas (tachado + rojo)
// y pinta el rango elegido como una píldora. Recibe `blocked`, `checkIn`, `checkOut` por `slotProps.day`.
export const BookingDay = ({ blocked, checkIn, checkOut, className, ...other }) => {
  const { day, outsideCurrentMonth } = other;
  const classes = [className];
  let booked = false;

  if (!outsideCurrentMonth) {
    booked = blocked?.has(day.format(ISO)) ?? false;
    const hasRange = checkIn?.isValid() && checkOut?.isValid() && checkOut.isAfter(checkIn, "day");

    if (booked) classes.push(styles.dayBooked);
    if (hasRange && day.isAfter(checkIn, "day") && day.isBefore(checkOut, "day")) {
      classes.push(styles.dayInRange);
    }
    if (hasRange && day.isSame(checkIn, "day")) classes.push(styles.dayRangeStart);
    if (hasRange && day.isSame(checkOut, "day")) classes.push(styles.dayRangeEnd);
  }

  return (
    <PickerDay
      {...other}
      className={classes.filter(Boolean).join(" ")}
      title={booked ? "Ocupado" : undefined}
    />
  );
};

// Barra inferior del popover (slot `actionBar`): leyenda de colores + "Limpiar".
// En móvil el picker no cierra al elegir, así que ahí se agrega "Aceptar" (reemplaza la barra por defecto).
export const CalendarLegend = () => {
  const { clearValue, acceptValueChanges } = usePickerActionsContext();
  const { variant } = usePickerContext();
  return (
    <div className={styles.legendBar}>
      <div className={styles.legendItems}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.legendBooked}`}>8</span>
          Ocupado
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.legendSelected}`}>8</span>
          Seleccionado
        </span>
      </div>
      <div className={styles.legendActions}>
        <button type="button" className={styles.legendClear} onClick={clearValue}>
          Limpiar
        </button>
        {variant === "mobile" && (
          <button type="button" className={styles.legendAccept} onClick={acceptValueChanges}>
            Aceptar
          </button>
        )}
      </div>
    </div>
  );
};
