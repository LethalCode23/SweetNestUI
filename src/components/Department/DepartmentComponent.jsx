import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ui from "../ui/catalog.module.css";
import { getAll, createDepartment, updateDepartment, deleteDepartment } from "../../services/departmentServices/departmentService";
import { DepartmentForm } from "../Department/DepartmentForm";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";
import { DataTable } from "../ui/DataTable/DataTable";
import { StatusBadge } from "../ui/StatusBadge/StatusBadge";
import { ConfirmDialog } from "../ui/ConfirmDialog/ConfirmDialog";
import { useConfirmDelete } from "../ui/ConfirmDialog/useConfirmDelete";
import { FilterSelect } from "../ui/FilterSelect/FilterSelect";
import { STATE_OPTIONS, optionsFrom } from "../ui/FilterSelect/options";
import { apiErrorMessage, unwrapList } from "../../Utils/apiError";

// La API devuelve el país en countryResponseDto; `pais` queda por compatibilidad
const countryOf = (d) => d.countryResponseDto ?? d.pais ?? null;

const COLUMNS = [
  {
    key: "depName",
    header: "Nombre",
    sortable: true,
    render: (d) => <span className={ui.name}>{d.depName}</span>,
  },
  {
    key: "country",
    header: "País",
    sortable: true,
    sortValue: (d) => d.countryName,
    render: (d) => d.countryName || <span className={ui.empty}>—</span>,
  },
  {
    key: "depSec",
    header: "ID",
    sortable: true,
    numeric: true,
    align: "left",
    width: 96,
    render: (d) => <span className={ui.muted}>{d.depSec}</span>,
  },
  {
    key: "depState",
    header: "Estado",
    render: (d) =>
      d.depState === "A"
        ? <StatusBadge tone="success" dot>Activo</StatusBadge>
        : <StatusBadge tone="neutral" dot>Inactivo</StatusBadge>,
  },
];

export const DepartmentComponent = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [stateFilter, setStateFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const { hasActionPermission } = useAuth();

  const canCreate = hasActionPermission(MODULES.DEPARTMENTS, ACTIONS.CREATE);
  const canUpdate = hasActionPermission(MODULES.DEPARTMENTS, ACTIONS.UPDATE);
  const canDelete = hasActionPermission(MODULES.DEPARTMENTS, ACTIONS.DELETE);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      // countryName/countrySec planos: la búsqueda y el orden del DataTable trabajan por campo
      const res = unwrapList(await getAll()).map((d) => ({
        ...d,
        countryName: countryOf(d)?.paiName ?? "",
        countrySec: countryOf(d)?.paiSec ?? null,
      }));
      setData(res);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const del = useConfirmDelete({
    onDelete: (d) => deleteDepartment(d.depSec),
    onDone: load,
    conflictMessage: "No se puede eliminar: el departamento tiene ciudades asociadas. Desactívalo en su lugar.",
  });

  const handleCreate = () => { setEditing(null); setShowForm(true); };
  const handleEdit = (d) => { setEditing(d); setShowForm(true); };

  // Guarda y recarga; si falla, el error sube al drawer
  const handleSubmit = async (payload) => {
    if (payload.depSec) await updateDepartment(payload);
    else await createDepartment(payload);
    await load();
  };

  const closeForm = () => { setShowForm(false); setEditing(null); };

  const countryOptions = optionsFrom(data, (d) => d.countrySec, (d) => d.countryName);

  const rows = data.filter((d) =>
    (!stateFilter || d.depState === stateFilter) &&
    (!countryFilter || String(d.countrySec) === countryFilter)
  );

  return (
    <div className={ui.page}>

      <p className={ui.intro}>Departamentos de cada país. Cada departamento agrupa sus ciudades.</p>

      {showForm && (
        <DepartmentForm key={editing?.depSec ?? "new"} initial={editing} onClose={closeForm} onSubmit={handleSubmit} />
      )}

      <DataTable
        ariaLabel="Departamentos"
        columns={COLUMNS}
        rows={rows}
        rowKey={(d) => d.depSec}
        loading={loading}
        error={error}
        onRetry={load}
        search={{ placeholder: "Buscar por nombre o país", keys: ["depName", "countryName"] }}
        filters={
          <>
            <FilterSelect label="Filtrar por estado" allLabel="Todos los estados"
              value={stateFilter} onChange={setStateFilter} options={STATE_OPTIONS} />
            <FilterSelect label="Filtrar por país" allLabel="Todos los países"
              value={countryFilter} onChange={setCountryFilter} options={countryOptions} />
          </>
        }
        filtersActive={Boolean(stateFilter || countryFilter)}
        onClearFilters={() => { setStateFilter(""); setCountryFilter(""); }}
        primaryAction={canCreate ? { label: "Nuevo departamento", icon: Plus, onClick: handleCreate } : null}
        rowActions={canUpdate || canDelete ? () => [
          { label: "Editar", icon: Pencil, onClick: handleEdit, hidden: !canUpdate },
          { label: "Eliminar", icon: Trash2, onClick: del.request, tone: "danger", hidden: !canDelete },
        ] : undefined}
        defaultSort={{ key: "depName", dir: "asc" }}
        emptyState={{
          title: "Todavía no hay departamentos",
          description: "Crea el primero y asígnale un país.",
        }}
      />

      <ConfirmDialog
        {...del.dialogProps}
        title={`¿Eliminar «${del.target?.depName ?? ""}»?`}
        description="El departamento deja de estar disponible. Esta acción no se puede deshacer."
        confirmLabel="Eliminar departamento"
      />
    </div>
  );
};
