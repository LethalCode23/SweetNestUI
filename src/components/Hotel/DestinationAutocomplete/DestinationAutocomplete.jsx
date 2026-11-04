import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Hotel, Loader2, MapPin, RotateCw } from "lucide-react";
import { MIN_CHARS, useSearchSuggestions } from "./useSearchSuggestions";
import styles from "./DestinationAutocomplete.module.css";

const TYPE_LABEL = { CITY: "Ciudad", HOTEL: "Hotel" };
const MIN_WIDTH = 280;

// Minúsculas y sin tildes, conservando la longitud (para resaltar sobre el texto original)
const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Pone en negrita la parte del nombre que coincide con lo escrito (sin distinguir tildes). */
const Highlight = ({ text, query }) => {
  const chars = [...text];
  const folded = chars.map((c) => fold(c));
  const q = fold(query);
  const joined = folded.join("");
  const at = q ? joined.indexOf(q) : -1;
  if (at < 0) return text;

  // Traducir la posición del texto "plegado" a índices de caracteres originales
  let pos = 0;
  let start = -1;
  let end = -1;
  folded.forEach((f, i) => {
    if (start < 0 && pos >= at) start = i;
    pos += f.length;
    if (end < 0 && pos >= at + q.length) end = i + 1;
  });
  if (start < 0 || end < 0) return text;

  return (
    <>
      {chars.slice(0, start).join("")}
      <strong>{chars.slice(start, end).join("")}</strong>
      {chars.slice(end).join("")}
    </>
  );
};

/**
 * Campo "Destino" con autocompletado de ciudades y hoteles (GET /api/hotel/suggestions).
 *
 *   <DestinationAutocomplete value={city} onChange={setCity} onSubmit={buscar}
 *                            inputClassName="search-input city-input" />
 *
 * - CITY  → llena el campo con la ciudad (el buscador filtra por citName).
 * - HOTEL → llena el campo y navega al detalle /hoteles/:id.
 * - Enter sin ninguna opción resaltada → onSubmit (el comportamiento de antes).
 * La lista se renderiza en un portal: el hero del home tiene overflow: hidden.
 */
export const DestinationAutocomplete = ({
  value,
  onChange,
  onSubmit,
  inputClassName = "",
  placeholder = "¿A dónde vas?",
  ariaLabel = "Destino: ciudad u hotel",
}) => {
  const navigate = useNavigate();
  const listId = useId();
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [rect, setRect] = useState(null);

  const { status, items, query, retry } = useSearchSuggestions(value);
  const showList = open && query.length >= MIN_CHARS;
  const selectable = status === "success" ? items : [];
  // El índice resaltado nunca apunta fuera de la lista actual
  const activeIndex = active < selectable.length ? active : -1;

  // ── Posición del portal: pegado al campo, recalculado en scroll / resize ──
  const measure = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.bottom + 8, left: r.left, width: Math.max(r.width, MIN_WIDTH) });
  }, []);

  useLayoutEffect(() => {
    if (!showList) return undefined;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [showList, measure]);

  // ── Clic afuera (el campo y la lista, que vive en un portal) ──
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current?.contains(e.target) || listRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Mantener visible la opción resaltada al navegar con flechas
  useEffect(() => {
    if (activeIndex < 0) return;
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const choose = (item) => {
    onChange(item.name);
    setOpen(false);
    setActive(-1);
    if (item.type === "HOTEL") navigate(`/hoteles/${item.id}`);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    setActive(-1);
    setOpen(e.target.value.trim().length > 0);
  };

  const handleKeyDown = (e) => {
    const count = selectable.length;
    switch (e.key) {
      case "ArrowDown":
        if (!showList) { setOpen(true); return; }
        if (!count) return;
        e.preventDefault();
        setActive((i) => (i + 1) % count);
        break;
      case "ArrowUp":
        if (!showList || !count) return;
        e.preventDefault();
        setActive((i) => (i <= 0 ? count - 1 : i - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (showList && activeIndex >= 0) choose(selectable[activeIndex]);
        else {
          setOpen(false);
          onSubmit?.();
        }
        break;
      case "Escape":
        if (showList) {
          e.preventDefault();
          setOpen(false);
          setActive(-1);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
    }
  };

  const optionId = (i) => `${listId}-opt-${i}`;

  const announcement = !showList
    ? ""
    : status === "loading"
      ? "Buscando sugerencias"
      : status === "error"
        ? "No se pudieron cargar las sugerencias"
        : items.length
          ? `${items.length} ${items.length === 1 ? "sugerencia" : "sugerencias"}`
          : "Sin coincidencias";

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <input
        ref={inputRef}
        className={inputClassName}
        type="text"
        role="combobox"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (value.trim().length >= MIN_CHARS) setOpen(true); }}
      />
      {showList && status === "loading" && (
        <Loader2 className={styles.inlineSpinner} size={16} aria-hidden="true" />
      )}

      <span className={styles.srOnly} aria-live="polite">{announcement}</span>

      {showList && rect && createPortal(
        <div
          ref={listRef}
          className={styles.panel}
          style={{ top: rect.top, left: rect.left, width: rect.width }}
        >
          {status === "error" ? (
            <div className={styles.state}>
              <span>No pudimos cargar sugerencias.</span>
              <button
                type="button"
                className={styles.retry}
                onMouseDown={(e) => e.preventDefault()}
                onClick={retry}
              >
                <RotateCw size={13} aria-hidden="true" /> Reintentar
              </button>
            </div>
          ) : status === "success" && items.length === 0 ? (
            <div className={styles.state}>
              No encontramos ciudades ni hoteles para «{query}».
            </div>
          ) : status === "loading" && items.length === 0 ? (
            <div className={styles.state}>
              <Loader2 className={styles.spin} size={15} aria-hidden="true" /> Buscando…
            </div>
          ) : (
            <ul
              id={listId}
              role="listbox"
              aria-label="Sugerencias de destino"
              className={`${styles.list} ${status === "loading" ? styles.stale : ""}`}
            >
              {items.map((item, i) => {
                const Icon = item.type === "HOTEL" ? Hotel : MapPin;
                const isActive = i === activeIndex;
                return (
                  <li
                    key={`${item.type}-${item.id}`}
                    id={optionId(i)}
                    data-index={i}
                    role="option"
                    aria-selected={isActive}
                    className={`${styles.option} ${isActive ? styles.active : ""}`}
                    // mousedown + preventDefault: el input no pierde el foco antes del clic
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => status === "success" && choose(item)}
                  >
                    <span className={`${styles.icon} ${item.type === "HOTEL" ? styles.iconHotel : ""}`} aria-hidden="true">
                      <Icon size={16} strokeWidth={1.75} />
                    </span>
                    <span className={styles.name}><Highlight text={item.name} query={query} /></span>
                    <span className={styles.type}>{TYPE_LABEL[item.type] ?? item.type}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default DestinationAutocomplete;
