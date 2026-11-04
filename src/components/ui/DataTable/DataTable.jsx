import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { IconButton } from "../IconButton/IconButton";
import styles from "./DataTable.module.css";

/**
 * Tabla del panel admin (DESIGN.md → Componentes → DataTable).
 * Presentacional: permisos y fetch los resuelve quien la usa.
 *
 * columns: [{ key, header, render?, sortable?, sortValue?, align?, width?, numeric? }]
 * search:  { placeholder, keys: ["campo"] }        → búsqueda local
 * filters: nodo con los filtros (el padre filtra `rows`)
 * filtersActive / onClearFilters: para distinguir "vacío" de "sin resultados por filtros"
 * primaryAction: { label, icon, onClick }          → omitir si no hay permiso
 * rowActions: (row) => [{ label, icon, onClick, tone?, hidden?, disabled? }]
 * pagination: { page, total, onPageChange }        → opcional, modo servidor (page base 1)
 */

const SKELETON_ROWS = 5;

// Minúsculas y sin tildes, para que "pequeño" encuentre "Pequeno" y viceversa
const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const compare = (a, b) => {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), "es", { numeric: true, sensitivity: "base" });
};

/** Páginas a mostrar: [1, "…", 4, 5, 6, "…", 12] */
const pageItems = (current, count) => {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(count - 1, current + 1);
  if (start > 2) items.push("start-gap");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < count - 1) items.push("end-gap");
  items.push(count);
  return items;
};

export const DataTable = ({
  columns,
  rows = [],
  rowKey,
  loading = false,
  error = null,
  onRetry,
  search,
  filters,
  filtersActive = false,
  onClearFilters,
  primaryAction,
  rowActions,
  defaultSort = null,
  pageSize = 10,
  emptyState = { title: "Todavía no hay registros", description: "" },
  pagination,
  ariaLabel,
}) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(defaultSort);
  const [localPage, setLocalPage] = useState(1);

  const isServer = Boolean(pagination);
  const hasActions = typeof rowActions === "function";
  const colSpan = columns.length + (hasActions ? 1 : 0);

  // Búsqueda + orden (solo en modo local; en modo servidor llegan resueltos)
  const processed = useMemo(() => {
    if (isServer) return rows;
    let list = rows;

    const q = normalize(query.trim());
    if (q && search?.keys?.length) {
      list = list.filter((row) => search.keys.some((k) => normalize(row[k]).includes(q)));
    }

    if (sort?.key) {
      const col = columns.find((c) => c.key === sort.key);
      const getValue = col?.sortValue ?? ((row) => row[sort.key]);
      list = [...list].sort((a, b) => compare(getValue(a), getValue(b)) * (sort.dir === "desc" ? -1 : 1));
    }
    return list;
  }, [rows, query, sort, columns, search, isServer]);

  const total = isServer ? pagination.total : processed.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  // Si los filtros del padre achican la lista, la página se ajusta sola
  const page = Math.min(isServer ? pagination.page : localPage, pageCount);
  const visible = isServer ? processed : processed.slice((page - 1) * pageSize, page * pageSize);

  const goTo = (p) => {
    const next = Math.min(Math.max(1, p), pageCount);
    if (isServer) pagination.onPageChange(next);
    else setLocalPage(next);
  };

  const handleQuery = (value) => {
    setQuery(value);
    setLocalPage(1);
  };

  const toggleSort = (key) => {
    setSort((s) => {
      if (s?.key !== key) return { key, dir: "asc" };
      return { key, dir: s.dir === "asc" ? "desc" : "asc" };
    });
    setLocalPage(1);
  };

  const hasQuery = query.trim() !== "";
  const isFiltered = hasQuery || filtersActive;

  const clearAll = () => {
    handleQuery("");
    onClearFilters?.();
  };
  const showEmpty = !loading && !error && visible.length === 0;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const PrimaryIcon = primaryAction?.icon;
  const primaryButton = primaryAction && (
    <button type="button" className="sn-btn sn-btn--primary" onClick={primaryAction.onClick}>
      {PrimaryIcon && <PrimaryIcon size={16} strokeWidth={2} aria-hidden="true" />}
      {primaryAction.label}
    </button>
  );

  return (
    <section className={styles.root} aria-label={ariaLabel}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        {search && (
          <label className={styles.search}>
            <Search className={styles.searchIcon} size={16} aria-hidden="true" />
            <input
              type="search"
              className={styles.searchInput}
              placeholder={search.placeholder ?? "Buscar"}
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
              aria-label={search.placeholder ?? "Buscar"}
            />
            {query && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => handleQuery("")}
                aria-label="Limpiar búsqueda"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </label>
        )}
        {filters && <div className={styles.filters}>{filters}</div>}
        {primaryButton && <div className={styles.toolbarEnd}>{primaryButton}</div>}
      </div>

      {/* ── Tabla ── */}
      <div className={styles.card}>
        <div className={styles.scroll}>
          <table className={styles.table} aria-busy={loading}>
            <thead>
              <tr>
                {columns.map((col) => {
                  const active = sort?.key === col.key;
                  const SortIcon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      style={col.width ? { width: col.width } : undefined}
                      className={styles[`align-${col.align ?? (col.numeric ? "right" : "left")}`]}
                      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                    >
                      {col.sortable && !isServer ? (
                        <button
                          type="button"
                          className={`${styles.sortBtn} ${active ? styles.sortActive : ""}`}
                          onClick={() => toggleSort(col.key)}
                        >
                          {col.header}
                          <SortIcon size={13} aria-hidden="true" />
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  );
                })}
                {hasActions && (
                  <th scope="col" className={`${styles["align-right"]} ${styles.stickyEnd}`}>
                    <span className={styles.srOnly}>Acciones</span>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: SKELETON_ROWS }, (_, i) => (
                  <tr key={`sk-${i}`} className={styles.skeletonRow}>
                    {Array.from({ length: colSpan }, (__, j) => (
                      <td key={j}>
                        <span className={styles.skeleton} style={{ width: `${45 + ((i + j) % 3) * 18}%` }} />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && error && (
                <tr>
                  <td colSpan={colSpan}>
                    <div className={styles.state} role="alert">
                      <p className={styles.stateTitle}>No pudimos cargar la lista</p>
                      <p className={styles.stateText}>{error}</p>
                      {onRetry && (
                        <button type="button" className="sn-btn sn-btn--secondary sn-btn--sm" onClick={onRetry}>
                          Reintentar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {showEmpty && (
                <tr>
                  <td colSpan={colSpan}>
                    {isFiltered ? (
                      <div className={styles.state}>
                        <p className={styles.stateTitle}>
                          {hasQuery ? `Ningún resultado para «${query.trim()}»` : "Ningún resultado con estos filtros"}
                        </p>
                        <p className={styles.stateText}>Prueba con otro nombre o revisa los filtros.</p>
                        <button type="button" className="sn-btn sn-btn--secondary sn-btn--sm" onClick={clearAll}>
                          {filtersActive ? "Limpiar búsqueda y filtros" : "Limpiar búsqueda"}
                        </button>
                      </div>
                    ) : (
                      <div className={styles.state}>
                        <p className={styles.stateTitle}>{emptyState.title}</p>
                        {emptyState.description && <p className={styles.stateText}>{emptyState.description}</p>}
                        {primaryButton}
                      </div>
                    )}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                visible.map((row) => {
                  const actions = hasActions ? rowActions(row).filter((a) => !a.hidden) : [];
                  return (
                    <tr key={rowKey(row)} className={styles.row}>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`${styles[`align-${col.align ?? (col.numeric ? "right" : "left")}`]} ${
                            col.numeric ? styles.numeric : ""
                          }`}
                        >
                          {col.render ? col.render(row) : row[col.key]}
                        </td>
                      ))}
                      {hasActions && (
                        <td className={`${styles["align-right"]} ${styles.stickyEnd}`}>
                          <div className={styles.actions}>
                            {actions.map((a, idx) => (
                              <IconButton
                                key={a.label}
                                icon={a.icon}
                                label={a.label}
                                tone={a.tone}
                                disabled={a.disabled}
                                onClick={() => a.onClick(row)}
                                tooltipAlign={idx === actions.length - 1 ? "end" : "center"}
                              />
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* ── Paginación ── */}
        {!loading && !error && total > 0 && (
          <div className={styles.footer}>
            <span className={styles.count}>
              {pageCount > 1 ? `Mostrando ${from}–${to} de ${total}` : `${total} ${total === 1 ? "registro" : "registros"}`}
            </span>
            {pageCount > 1 && (
              <nav className={styles.pager} aria-label="Paginación">
                <button
                  type="button"
                  className={styles.pageNav}
                  onClick={() => goTo(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  Anterior
                </button>
                {pageItems(page, pageCount).map((item) =>
                  typeof item === "number" ? (
                    <button
                      key={item}
                      type="button"
                      className={`${styles.pageBtn} ${item === page ? styles.pageCurrent : ""}`}
                      onClick={() => goTo(item)}
                      aria-current={item === page ? "page" : undefined}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={item} className={styles.pageGap} aria-hidden="true">
                      …
                    </span>
                  )
                )}
                <button
                  type="button"
                  className={styles.pageNav}
                  onClick={() => goTo(page + 1)}
                  disabled={page === pageCount}
                >
                  Siguiente
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DataTable;
