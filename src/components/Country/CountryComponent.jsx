import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ui from "../ui/catalog.module.css";
import { getAll, createCountry, updateCountry, deleteCountry } from "../../services/countryServices/countryService";
import { CountryForm } from "../Country/CountryForm";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";
import { DataTable } from "../ui/DataTable/DataTable";
import { StatusBadge } from "../ui/StatusBadge/StatusBadge";
import { ConfirmDialog } from "../ui/ConfirmDialog/ConfirmDialog";
import { useConfirmDelete } from "../ui/ConfirmDialog/useConfirmDelete";
import { FilterSelect } from "../ui/FilterSelect/FilterSelect";
import { STATE_OPTIONS } from "../ui/FilterSelect/options";
import { apiErrorMessage, unwrapList } from "../../Utils/apiError";

const COLUMNS = [
  {
    key: "paiName",
    header: "Nombre",
    sortable: true,
    render: (c) => <span className={ui.name}>{c.paiName}</span>,
  },
  {
    key: "paiSec",
    header: "ID",
    sortable: true,
    numeric: true,
    align: "left",
    width: 96,
    render: (c) => <span className={ui.muted}>{c.paiSec}</span>,
  },
  {
    key: "paiState",
    header: "Estado",
    render: (c) =>
      c.paiState === "A"
        ? <StatusBadge tone="success" dot>Activo</StatusBadge>
        : <StatusBadge tone="neutral" dot>Inactivo</StatusBadge>,
  },
];

export const CountryComponent = () => {

  const { hasActionPermission } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [stateFilter, setStateFilter] = useState("");

  const canCreate = hasActionPermission(MODULES.COUNTRIES, ACTIONS.CREATE);
  const canUpdate = hasActionPermission(MODULES.COUNTRIES, ACTIONS.UPDATE);
  const canDelete = hasActionPermission(MODULES.COUNTRIES, ACTIONS.DELETE);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = unwrapList(await getAll());
      res.sort((a, b) => String(a.paiName).localeCompare(String(b.paiName)));
      setData(res);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const del = useConfirmDelete({
    onDelete: (c) => deleteCountry(c.paiSec),
    onDone: load,
    conflictMessage: "No se puede eliminar: el país tiene departamentos asociados. Desactívalo en su lugar.",
  });

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (country) => {
    setEditing(country);
    setShowForm(true);
  };

  // Guarda y recarga; si falla, el error sube al drawer (que se cierra solo al terminar bien)
  const handleSubmit = async (payload) => {
    if (payload.paiSec) {
      await updateCountry(payload);
    } else {
      await createCountry(payload);
    }
    await load();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const rows = data.filter((c) => !stateFilter || c.paiState === stateFilter);

  return (
    <div className={ui.page}>

      <p className={ui.intro}>Países donde hay alojamientos. Cada país agrupa sus departamentos.</p>

      {showForm && (
        <CountryForm key={editing?.paiSec ?? "new"} initial={editing} onClose={closeForm} onSubmit={handleSubmit} />
      )}

      <DataTable
        ariaLabel="Países"
        columns={COLUMNS}
        rows={rows}
        rowKey={(c) => c.paiSec}
        loading={loading}
        error={error}
        onRetry={load}
        search={{ placeholder: "Buscar por nombre", keys: ["paiName"] }}
        filters={
          <FilterSelect label="Filtrar por estado" allLabel="Todos los estados"
            value={stateFilter} onChange={setStateFilter} options={STATE_OPTIONS} />
        }
        filtersActive={Boolean(stateFilter)}
        onClearFilters={() => setStateFilter("")}
        primaryAction={canCreate ? { label: "Nuevo país", icon: Plus, onClick: handleCreate } : null}
        rowActions={canUpdate || canDelete ? () => [
          { label: "Editar", icon: Pencil, onClick: handleEdit, hidden: !canUpdate },
          { label: "Eliminar", icon: Trash2, onClick: del.request, tone: "danger", hidden: !canDelete },
        ] : undefined}
        defaultSort={{ key: "paiName", dir: "asc" }}
        emptyState={{
          title: "Todavía no hay países",
          description: "Crea el primero para poder cargar sus departamentos y ciudades.",
        }}
      />

      <ConfirmDialog
        {...del.dialogProps}
        title={`¿Eliminar «${del.target?.paiName ?? ""}»?`}
        description="El país deja de estar disponible. Esta acción no se puede deshacer."
        confirmLabel="Eliminar país"
      />
    </div>
  );
};
