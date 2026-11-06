import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
    getAll,
    createHotelType,
    updateHotelType,
    deleteHotelType,
} from "../../services/hotelServices/typeHotelService";
import { HotelTypeForm } from "./HotelTypeForm";
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

const UNIT_OPTIONS = [
    { value: "N", label: "Unidad única" },
    { value: "S", label: "Varias unidades" },
];

const COLUMNS = [
    {
        key: "typName",
        header: "Nombre",
        sortable: true,
        render: (t) => <span className={ui.name}>{t.typName}</span>,
    },
    {
        key: "typSec",
        header: "ID",
        sortable: true,
        numeric: true,
        align: "left",
        width: 96,
        render: (t) => <span className={ui.muted}>{t.typSec}</span>,
    },
    {
        key: "typMultiUnit",
        header: "Unidad",
        render: (t) =>
            t.typMultiUnit === "S"
                ? <StatusBadge tone="info">Varias</StatusBadge>
                : <StatusBadge tone="neutral">Única</StatusBadge>,
    },
    {
        key: "typState",
        header: "Estado",
        render: (t) =>
            t.typState === "A"
                ? <StatusBadge tone="success" dot>Activo</StatusBadge>
                : <StatusBadge tone="neutral" dot>Inactivo</StatusBadge>,
    },
];

export const HotelTypeComponent = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [stateFilter, setStateFilter] = useState("");
    const [unitFilter, setUnitFilter] = useState("");
    const { hasActionPermission } = useAuth();

    const canCreate = hasActionPermission(MODULES.HOTEL_TYPES, ACTIONS.CREATE);
    const canUpdate = hasActionPermission(MODULES.HOTEL_TYPES, ACTIONS.UPDATE);
    const canDelete = hasActionPermission(MODULES.HOTEL_TYPES, ACTIONS.DELETE);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {

        setLoading(true);
        setError(null);

        try {

            const res = unwrapList(await getAll());
            res.sort((a, b) => String(a.typName).localeCompare(String(b.typName)));
            setData(res);

        } catch (err) {
            setError(apiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const del = useConfirmDelete({
        onDelete: (t) => deleteHotelType(t.typSec),
        onDone: load,
        conflictMessage: "No se puede eliminar: hay alojamientos que usan este tipo. Desactívalo en su lugar.",
    });

    const handleCreate = () => {
        setEditing(null);
        setShowForm(true);
    };

    const handleEdit = (hotelType) => {
        setEditing(hotelType);
        setShowForm(true);
    };

    // Guarda y recarga; si falla, el error sube al drawer
    const handleSubmit = async (payload) => {
        const { typSec, ...body } = payload;

        if (typSec) {
            await updateHotelType(typSec, body);
        } else {
            await createHotelType(body);
        }
        await load();
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
    };

    const rows = data.filter((t) =>
        (!stateFilter || t.typState === stateFilter) &&
        (!unitFilter || t.typMultiUnit === unitFilter)
    );

    return (
        <div className={ui.page}>

            <p className={ui.intro}>
                Define cómo se reserva cada alojamiento: los tipos con varias unidades
                permiten cargar habitaciones; los de unidad única se reservan completos.
            </p>

            {showForm && (
                <HotelTypeForm key={editing?.typSec ?? "new"} initial={editing} onClose={closeForm} onSubmit={handleSubmit} />
            )}

            <DataTable
                ariaLabel="Tipos de alojamiento"
                columns={COLUMNS}
                rows={rows}
                rowKey={(t) => t.typSec}
                loading={loading}
                error={error}
                onRetry={load}
                search={{ placeholder: "Buscar por nombre", keys: ["typName"] }}
                filters={
                    <>
                        <FilterSelect label="Filtrar por estado" allLabel="Todos los estados"
                            value={stateFilter} onChange={setStateFilter} options={STATE_OPTIONS} />
                        <FilterSelect label="Filtrar por unidad" allLabel="Todas las unidades"
                            value={unitFilter} onChange={setUnitFilter} options={UNIT_OPTIONS} />
                    </>
                }
                filtersActive={Boolean(stateFilter || unitFilter)}
                onClearFilters={() => { setStateFilter(""); setUnitFilter(""); }}
                primaryAction={canCreate ? { label: "Nuevo tipo", icon: Plus, onClick: handleCreate } : null}
                rowActions={canUpdate || canDelete ? () => [
                    { label: "Editar", icon: Pencil, onClick: handleEdit, hidden: !canUpdate },
                    { label: "Eliminar", icon: Trash2, onClick: del.request, tone: "danger", hidden: !canDelete },
                ] : undefined}
                defaultSort={{ key: "typName", dir: "asc" }}
                emptyState={{
                    title: "Todavía no hay tipos de alojamiento",
                    description: "Crea el primero para poder asignarlo a los hoteles.",
                }}
            />

            <ConfirmDialog
                {...del.dialogProps}
                title={`¿Eliminar «${del.target?.typName ?? ""}»?`}
                description="El tipo deja de estar disponible para nuevos alojamientos. Esta acción no se puede deshacer."
                confirmLabel="Eliminar tipo"
            />

        </div>
    );
};
