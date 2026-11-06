import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import CityForm from "../components/City/CityForm";
import { deleteCity, getCities } from "../services/cityServices/cityService";
import { getAll as getDepartments } from "../services/departmentServices/departmentService";
import ui from "../components/ui/catalog.module.css";
import { useAuth } from "../context/AuthContext";
import { MODULES, ACTIONS } from "../constants/modules";
import { DataTable } from "../components/ui/DataTable/DataTable";
import { StatusBadge } from "../components/ui/StatusBadge/StatusBadge";
import { ConfirmDialog } from "../components/ui/ConfirmDialog/ConfirmDialog";
import { useConfirmDelete } from "../components/ui/ConfirmDialog/useConfirmDelete";
import { FilterSelect } from "../components/ui/FilterSelect/FilterSelect";
import { STATE_OPTIONS, optionsFrom } from "../components/ui/FilterSelect/options";
import { apiErrorMessage, unwrapList } from "../Utils/apiError";

const dash = <span className={ui.empty}>—</span>;

const COLUMNS = [
  {
    key: "citName",
    header: "Nombre",
    sortable: true,
    render: (c) => <span className={ui.name}>{c.citName}</span>,
  },
  {
    key: "depName",
    header: "Departamento",
    sortable: true,
    render: (c) => c.depName || dash,
  },
  {
    key: "countryName",
    header: "País",
    sortable: true,
    render: (c) => (c.countryName ? <span className={ui.muted}>{c.countryName}</span> : dash),
  },
  {
    key: "citSec",
    header: "ID",
    sortable: true,
    numeric: true,
    align: "left",
    width: 96,
    render: (c) => <span className={ui.muted}>{c.citSec}</span>,
  },
  {
    key: "citState",
    header: "Estado",
    render: (c) =>
      c.citState === "A"
        ? <StatusBadge tone="success" dot>Activo</StatusBadge>
        : <StatusBadge tone="neutral" dot>Inactivo</StatusBadge>,
  },
];

const CitiesPage = () => {

  const { hasActionPermission } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [stateFilter, setStateFilter] = useState("");
  const [depFilter, setDepFilter] = useState("");

  const canCreate = hasActionPermission(MODULES.CITIES, ACTIONS.CREATE);
  const canUpdate = hasActionPermission(MODULES.CITIES, ACTIONS.UPDATE);
  const canDelete = hasActionPermission(MODULES.CITIES, ACTIONS.DELETE);

  // La API de ciudades solo trae citDepSec: se cruza con los departamentos
  // (que traen su país) para mostrar nombres en lugar del número.
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cities, departments] = await Promise.all([getCities(), getDepartments()]);
      const depById = new Map(unwrapList(departments).map((d) => [String(d.depSec), d]));
      setData(unwrapList(cities).map((c) => {
        const dep = depById.get(String(c.citDepSec ?? c.department?.depSec));
        return {
          ...c,
          depName: dep?.depName ?? c.department?.depName ?? "",
          countryName: dep?.countryResponseDto?.paiName ?? dep?.pais?.paiName ?? "",
        };
      }));
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const del = useConfirmDelete({
    onDelete: (c) => deleteCity(c.citSec),
    onDone: load,
    conflictMessage: "No se puede eliminar: hay hoteles en esta ciudad. Desactívala en su lugar.",
  });

  const handleCreate = () => { setEditing(null); setShowForm(true); };

  const handleEdit = (city) => { setEditing(city); setShowForm(true); };

  const depOptions = optionsFrom(data, (c) => c.citDepSec, (c) => c.depName || `#${c.citDepSec}`);

  const rows = data.filter((c) =>
    (!stateFilter || c.citState === stateFilter) &&
    (!depFilter || String(c.citDepSec) === depFilter)
  );

  return (

    <div className={ui.page}>

      <p className={ui.intro}>Ciudades donde se ubican los alojamientos, agrupadas por departamento.</p>

      {showForm && (
        <CityForm
          key={editing?.citSec ?? "new"}
          editingCity={editing}
          onSuccess={load}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <DataTable
        ariaLabel="Ciudades"
        columns={COLUMNS}
        rows={rows}
        rowKey={(c) => c.citSec}
        loading={loading}
        error={error}
        onRetry={load}
        search={{ placeholder: "Buscar por ciudad o departamento", keys: ["citName", "depName", "countryName"] }}
        filters={
          <>
            <FilterSelect label="Filtrar por estado" allLabel="Todos los estados"
              value={stateFilter} onChange={setStateFilter} options={STATE_OPTIONS} />
            <FilterSelect label="Filtrar por departamento" allLabel="Todos los departamentos"
              value={depFilter} onChange={setDepFilter} options={depOptions} />
          </>
        }
        filtersActive={Boolean(stateFilter || depFilter)}
        onClearFilters={() => { setStateFilter(""); setDepFilter(""); }}
        primaryAction={canCreate ? { label: "Nueva ciudad", icon: Plus, onClick: handleCreate } : null}
        rowActions={canUpdate || canDelete ? () => [
          { label: "Editar", icon: Pencil, onClick: handleEdit, hidden: !canUpdate },
          { label: "Eliminar", icon: Trash2, onClick: del.request, tone: "danger", hidden: !canDelete },
        ] : undefined}
        defaultSort={{ key: "citName", dir: "asc" }}
        emptyState={{
          title: "Todavía no hay ciudades",
          description: "Crea la primera y asígnale un departamento.",
        }}
      />

      <ConfirmDialog
        {...del.dialogProps}
        title={`¿Eliminar «${del.target?.citName ?? ""}»?`}
        description="La ciudad deja de estar disponible para nuevos alojamientos. Esta acción no se puede deshacer."
        confirmLabel="Eliminar ciudad"
      />

    </div>
  );
};

export default CitiesPage;
