import { useState, useEffect } from "react";
import { Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import {
  getAllFeatures,
  createFeature,
  updateFeature,
  deleteFeature
} from "../../services/featureServices/featureService";
import { FeatureForm } from "./FeatureForm";
import ui from "../ui/catalog.module.css";
import styles from "./FeaturePage.module.css";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";
import { Environment } from "../../Environments/Environment";
import { DataTable } from "../ui/DataTable/DataTable";
import { StatusBadge } from "../ui/StatusBadge/StatusBadge";
import { ConfirmDialog } from "../ui/ConfirmDialog/ConfirmDialog";
import { useConfirmDelete } from "../ui/ConfirmDialog/useConfirmDelete";
import { FilterSelect } from "../ui/FilterSelect/FilterSelect";
import { STATE_OPTIONS } from "../ui/FilterSelect/options";
import { apiErrorMessage, unwrapList } from "../../Utils/apiError";

// La API usa feaSec/feaName/feaEst/feaIconUrl; id/name/state quedan por compatibilidad
const idOf = (f) => f.feaSec ?? f.id;
const nameOf = (f) => f.feaName ?? f.name ?? "";
const stateOf = (f) => f.feaEst ?? f.feaState ?? f.state ?? "A";

const iconSrc = (url) => (!url ? null : /^https?:\/\//.test(url) ? url : `${Environment.API_URL_IMG}${url}`);

const COLUMNS = [
  {
    key: "icon",
    header: "Icono",
    width: 72,
    render: (f) => {
      const src = iconSrc(f.feaIconUrl);
      return (
        <span className={styles.icon} aria-hidden="true">
          {src ? <img src={src} alt="" /> : <Sparkles size={16} strokeWidth={1.75} />}
        </span>
      );
    },
  },
  {
    key: "feaName",
    header: "Nombre",
    sortable: true,
    sortValue: nameOf,
    render: (f) => <span className={ui.name}>{nameOf(f)}</span>,
  },
  {
    key: "feaSec",
    header: "ID",
    sortable: true,
    numeric: true,
    align: "left",
    width: 96,
    sortValue: idOf,
    render: (f) => <span className={ui.muted}>{idOf(f)}</span>,
  },
  {
    key: "feaEst",
    header: "Estado",
    render: (f) =>
      stateOf(f) === "A"
        ? <StatusBadge tone="success" dot>Activo</StatusBadge>
        : <StatusBadge tone="neutral" dot>Inactivo</StatusBadge>,
  },
];

export const FeatureComponent = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [stateFilter, setStateFilter] = useState("");

  const { hasActionPermission } = useAuth();

  // "Features" es el nombre viejo del submódulo; se mantiene por compatibilidad
  const can = (action) =>
    hasActionPermission(MODULES.FEATURES, action) || hasActionPermission("Features", action);
  const canCreate = can(ACTIONS.CREATE);
  const canUpdate = can(ACTIONS.UPDATE);
  const canDelete = can(ACTIONS.DELETE);

  const loadFeatures = async () => {
    setLoading(true);
    setError(null);
    try {
      const featureList = unwrapList(await getAllFeatures());
      featureList.sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
      setFeatures(featureList);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const del = useConfirmDelete({
    onDelete: (f) => deleteFeature(idOf(f)),
    onDone: loadFeatures,
    conflictMessage: "No se puede eliminar: hay hoteles con esta característica. Desactívala en su lugar.",
  });

  const handleCreate = () => {
    setEditingFeature(null);
    setShowForm(true);
  };

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingFeature(null);
    setShowForm(false);
  };

  // Guarda y recarga; si falla, el error sube al drawer
  const handleSubmit = async (payload) => {
    const targetId = editingFeature ? idOf(editingFeature) : null;

    if (targetId) {
      await updateFeature(targetId, payload);
    } else {
      await createFeature(payload);
    }
    await loadFeatures();
  };

  const rows = features.filter((f) => !stateFilter || stateOf(f) === stateFilter);

  return (
    <div className={ui.page}>

      <p className={ui.intro}>Servicios y comodidades que se pueden marcar en cada alojamiento (Wi-Fi, piscina, parqueadero…).</p>

      {showForm && (
        <FeatureForm
          key={editingFeature ? idOf(editingFeature) : "new"}
          initial={editingFeature}
          onClose={handleCancelForm}
          onSubmit={handleSubmit}
        />
      )}

      <DataTable
        ariaLabel="Características"
        columns={COLUMNS}
        rows={rows}
        rowKey={idOf}
        loading={loading}
        error={error}
        onRetry={loadFeatures}
        search={{ placeholder: "Buscar por nombre", keys: ["feaName", "name"] }}
        filters={
          <FilterSelect label="Filtrar por estado" allLabel="Todos los estados"
            value={stateFilter} onChange={setStateFilter} options={STATE_OPTIONS} />
        }
        filtersActive={Boolean(stateFilter)}
        onClearFilters={() => setStateFilter("")}
        primaryAction={canCreate ? { label: "Nueva característica", icon: Plus, onClick: handleCreate } : null}
        rowActions={canUpdate || canDelete ? () => [
          { label: "Editar", icon: Pencil, onClick: handleEdit, hidden: !canUpdate },
          { label: "Eliminar", icon: Trash2, onClick: del.request, tone: "danger", hidden: !canDelete },
        ] : undefined}
        defaultSort={{ key: "feaName", dir: "asc" }}
        emptyState={{
          title: "Todavía no hay características",
          description: "Crea la primera para poder marcarla en los alojamientos.",
        }}
      />

      <ConfirmDialog
        {...del.dialogProps}
        title={`¿Eliminar «${del.target ? nameOf(del.target) : ""}»?`}
        description="La característica deja de estar disponible. Esta acción no se puede deshacer."
        confirmLabel="Eliminar característica"
      />
    </div>
  );
};
