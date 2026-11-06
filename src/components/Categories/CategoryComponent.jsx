import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getAll, createCategory, updateCategory, deleteCategory } from "../../services/categoryServices/categoryService";
import { CategoryForm } from "../Categories/CategoryForm";
import ui from "../ui/catalog.module.css";
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
    key: "catName",
    header: "Nombre",
    sortable: true,
    render: (c) => <span className={ui.name}>{c.catName}</span>,
  },
  {
    key: "catSec",
    header: "ID",
    sortable: true,
    numeric: true,
    align: "left",
    width: 96,
    render: (c) => <span className={ui.muted}>{c.catSec}</span>,
  },
  {
    key: "catEst",
    header: "Estado",
    render: (c) =>
      c.catEst === "A"
        ? <StatusBadge tone="success" dot>Activo</StatusBadge>
        : <StatusBadge tone="neutral" dot>Inactivo</StatusBadge>,
  },
];

export const CategoryComponent = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [stateFilter, setStateFilter] = useState("");
  const { hasActionPermission } = useAuth();

  const canCreate = hasActionPermission(MODULES.CATEGORIES, ACTIONS.CREATE);
  const canUpdate = hasActionPermission(MODULES.CATEGORIES, ACTIONS.UPDATE);
  const canDelete = hasActionPermission(MODULES.CATEGORIES, ACTIONS.DELETE);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {

    setLoading(true);
    setError(null);

    try {

      const res = unwrapList(await getAll());
      res.sort((a, b) => String(a.catName).localeCompare(String(b.catName)));
      setData(res);

    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const del = useConfirmDelete({
    onDelete: (c) => deleteCategory(c.catSec),
    onDone: load,
    conflictMessage: "No se puede eliminar: hay hoteles con esta categoría. Desactívala en su lugar.",
  });

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditing(category);
    setShowForm(true);
  };

  // Guarda y recarga; si falla, el error sube al drawer
  const handleSubmit = async (payload) => {
    if (payload.catSec) {
      await updateCategory(payload);
    } else {
      await createCategory(payload);
    }
    await load();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const rows = data.filter((c) => !stateFilter || c.catEst === stateFilter);

  return (
    <div className={ui.page}>

      <p className={ui.intro}>Categorías para agrupar los alojamientos en la búsqueda (por ejemplo, Playa o Montaña).</p>

      {showForm && (
        <CategoryForm key={editing?.catSec ?? "new"} initial={editing} onClose={closeForm} onSubmit={handleSubmit} />
      )}

      <DataTable
        ariaLabel="Categorías"
        columns={COLUMNS}
        rows={rows}
        rowKey={(c) => c.catSec}
        loading={loading}
        error={error}
        onRetry={load}
        search={{ placeholder: "Buscar por nombre", keys: ["catName"] }}
        filters={
          <FilterSelect label="Filtrar por estado" allLabel="Todos los estados"
            value={stateFilter} onChange={setStateFilter} options={STATE_OPTIONS} />
        }
        filtersActive={Boolean(stateFilter)}
        onClearFilters={() => setStateFilter("")}
        primaryAction={canCreate ? { label: "Nueva categoría", icon: Plus, onClick: handleCreate } : null}
        rowActions={canUpdate || canDelete ? () => [
          { label: "Editar", icon: Pencil, onClick: handleEdit, hidden: !canUpdate },
          { label: "Eliminar", icon: Trash2, onClick: del.request, tone: "danger", hidden: !canDelete },
        ] : undefined}
        defaultSort={{ key: "catName", dir: "asc" }}
        emptyState={{
          title: "Todavía no hay categorías",
          description: "Crea la primera para poder clasificar los alojamientos.",
        }}
      />

      <ConfirmDialog
        {...del.dialogProps}
        title={`¿Eliminar «${del.target?.catName ?? ""}»?`}
        description="La categoría deja de estar disponible. Esta acción no se puede deshacer."
        confirmLabel="Eliminar categoría"
      />

    </div>
  );
};
