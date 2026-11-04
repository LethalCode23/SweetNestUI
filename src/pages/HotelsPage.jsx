import { useEffect, useState } from "react";
import { Hotel, Pencil, Plus, Trash2 } from "lucide-react";
import { getHotels, deleteHotel } from "../services/hotelServices/hotelService";
import HotelForm from "../components/Hotel/HotelForm";
import ui from "../components/ui/catalog.module.css";
import styles from "./HotelsPage.module.css";
import { MODULES, ACTIONS } from "../constants/modules";
import { useAuth } from "../context/AuthContext";
import { Environment } from "../Environments/Environment";
import { DataTable } from "../components/ui/DataTable/DataTable";
import { StatusBadge } from "../components/ui/StatusBadge/StatusBadge";
import { ConfirmDialog } from "../components/ui/ConfirmDialog/ConfirmDialog";
import { useConfirmDelete } from "../components/ui/ConfirmDialog/useConfirmDelete";
import { FilterSelect } from "../components/ui/FilterSelect/FilterSelect";
import { STATE_OPTIONS, optionsFrom } from "../components/ui/FilterSelect/options";
import { apiErrorMessage } from "../Utils/apiError";

// /hotel/all no filtra por nombre: se trae todo y se busca/filtra en el cliente
const FETCH_SIZE = 1000;
const MAX_CATEGORIES = 2;

const formatCOP = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n ?? 0);

const thumbnailOf = (h) => {
  const url = h.hotelImagesUrl?.[0]?.hotImgUrl;
  if (!url) return null;
  return /^https?:\/\//.test(url) ? url : `${Environment.API_URL_IMG}${url}`;
};

const dash = <span className={ui.empty}>—</span>;

const COLUMNS = [
  {
    key: "hotName",
    header: "Hotel",
    sortable: true,
    render: (h) => {
      const src = thumbnailOf(h);
      return (
        <span className={styles.hotel}>
          <span className={styles.thumb} aria-hidden="true">
            {src ? <img src={src} alt="" loading="lazy" /> : <Hotel size={18} strokeWidth={1.75} />}
          </span>
          <span className={ui.stack}>
            <span className={ui.name}>{h.hotName}</span>
            {h.hotAddress && <span className={ui.stackSub}>{h.hotAddress}</span>}
          </span>
        </span>
      );
    },
  },
  {
    key: "hotCitName",
    header: "Ciudad",
    sortable: true,
    render: (h) => h.hotCitName || dash,
  },
  {
    key: "typeName",
    header: "Tipo",
    sortable: true,
    render: (h) => (h.typeName ? <span className={ui.muted}>{h.typeName}</span> : dash),
  },
  {
    key: "hotCost",
    header: "Costo / noche",
    sortable: true,
    numeric: true,
    render: (h) => formatCOP(h.hotCost),
  },
  {
    key: "categories",
    header: "Categorías",
    render: (h) => {
      const cats = h.categories ?? [];
      if (!cats.length) return dash;
      const rest = cats.length - MAX_CATEGORIES;
      return (
        <span className={styles.tags}>
          {cats.slice(0, MAX_CATEGORIES).map((c) => (
            <StatusBadge key={c.catSec} tone="neutral">{c.catName}</StatusBadge>
          ))}
          {rest > 0 && (
            <span className={ui.muted} title={cats.slice(MAX_CATEGORIES).map((c) => c.catName).join(", ")}>
              +{rest}
            </span>
          )}
        </span>
      );
    },
  },
  {
    key: "hotState",
    header: "Estado",
    render: (h) =>
      h.hotState === "A"
        ? <StatusBadge tone="success" dot>Activo</StatusBadge>
        : <StatusBadge tone="neutral" dot>Inactivo</StatusBadge>,
  },
];

export default function HotelsPage() {

  const { hasActionPermission } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const canCreate = hasActionPermission(MODULES.HOTELS, ACTIONS.CREATE);
  const canUpdate = hasActionPermission(MODULES.HOTELS, ACTIONS.UPDATE);
  const canDelete = hasActionPermission(MODULES.HOTELS, ACTIONS.DELETE);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHotels(0, FETCH_SIZE);
      setHotels(data?.content ?? []);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const del = useConfirmDelete({
    onDelete: (h) => deleteHotel(h.hotSec),
    onDone: fetchHotels,
    conflictMessage: "No se puede eliminar: el hotel tiene unidades o reservas. Desactívalo en su lugar.",
  });

  const openCreate = () => { setEditingHotel(null); setDrawerOpen(true); };
  const openEdit = (hotel) => { setEditingHotel(hotel); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setEditingHotel(null); };

  const typeOptions = optionsFrom(hotels, (h) => h.typeId, (h) => h.typeName);
  const cityOptions = optionsFrom(hotels, (h) => h.hotCitSec, (h) => h.hotCitName);

  const rows = hotels.filter((h) =>
    (!stateFilter || h.hotState === stateFilter) &&
    (!typeFilter || String(h.typeId) === typeFilter) &&
    (!cityFilter || String(h.hotCitSec) === cityFilter)
  );

  return (
    <div className={ui.page}>

      <p className={ui.intro}>Alojamientos publicados en SweetNest. Los inactivos no aparecen en la búsqueda pública.</p>

      <DataTable
        ariaLabel="Hoteles"
        columns={COLUMNS}
        rows={rows}
        rowKey={(h) => h.hotSec}
        loading={loading}
        error={error}
        onRetry={fetchHotels}
        search={{ placeholder: "Buscar por nombre, ciudad o dirección", keys: ["hotName", "hotCitName", "hotAddress"] }}
        filters={
          <>
            <FilterSelect label="Filtrar por estado" allLabel="Todos los estados"
              value={stateFilter} onChange={setStateFilter} options={STATE_OPTIONS} />
            <FilterSelect label="Filtrar por tipo" allLabel="Todos los tipos"
              value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
            <FilterSelect label="Filtrar por ciudad" allLabel="Todas las ciudades"
              value={cityFilter} onChange={setCityFilter} options={cityOptions} />
          </>
        }
        filtersActive={Boolean(stateFilter || typeFilter || cityFilter)}
        onClearFilters={() => { setStateFilter(""); setTypeFilter(""); setCityFilter(""); }}
        primaryAction={canCreate ? { label: "Nuevo hotel", icon: Plus, onClick: openCreate } : null}
        rowActions={canUpdate || canDelete ? () => [
          { label: "Editar", icon: Pencil, onClick: openEdit, hidden: !canUpdate },
          { label: "Eliminar", icon: Trash2, onClick: del.request, tone: "danger", hidden: !canDelete },
        ] : undefined}
        defaultSort={{ key: "hotName", dir: "asc" }}
        emptyState={{
          title: "Todavía no hay hoteles",
          description: "Crea el primero para que aparezca en la búsqueda.",
        }}
      />

      {drawerOpen && (
        <HotelForm
          key={editingHotel?.hotSec ?? "new"}
          editingHotel={editingHotel}
          onSuccess={fetchHotels}
          onClose={closeDrawer}
        />
      )}

      <ConfirmDialog
        {...del.dialogProps}
        title={`¿Eliminar «${del.target?.hotName ?? ""}»?`}
        description="El hotel deja de aparecer en el panel y en la búsqueda. Esta acción no se puede deshacer."
        confirmLabel="Eliminar hotel"
      />
    </div>
  );
}
