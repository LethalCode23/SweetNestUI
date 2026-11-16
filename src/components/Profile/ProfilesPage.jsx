import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Pencil, Plus } from "lucide-react";
import ui from "../ui/catalog.module.css";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";
import { DataTable } from "../ui/DataTable/DataTable";
import { StatusBadge } from "../ui/StatusBadge/StatusBadge";
import { FilterSelect } from "../ui/FilterSelect/FilterSelect";
import { STATE_OPTIONS } from "../ui/FilterSelect/options";
import { ProfileForm } from "./ProfileForm";
import { getAllProfiles, createProfile, updateProfile } from "../../services/profileServices/ProfileServices";
import { getUsers } from "../../services/userServices/userService";
import { apiErrorMessage, unwrapList } from "../../Utils/apiError";
import styles from "./ProfilesPage.module.css";

const COLUMNS = [
    {
        key: "proName",
        header: "Perfil",
        sortable: true,
        render: (p) => (
            <span className={styles.nameCell}>
                <span className={ui.name}>{p.proName}</span>
                {p.isDefault === "S" && <StatusBadge tone="neutral">Por defecto</StatusBadge>}
            </span>
        ),
    },
    {
        key: "hasControlAccess",
        header: "Control de accesos",
        render: (p) => (p.hasControlAccess === "S"
            ? <StatusBadge tone="info">Administra accesos</StatusBadge>
            : <span className={ui.empty}>—</span>),
    },
    {
        key: "userCount",
        header: "Usuarios",
        sortable: true,
        numeric: true,
        align: "left",
        width: 110,
        render: (p) => (p.userCount
            ? p.userCount
            : <span className={ui.empty}>0</span>),
    },
    {
        key: "proState",
        header: "Estado",
        sortable: true,
        width: 120,
        render: (p) => (p.proState === "A"
            ? <StatusBadge tone="success" dot>Activo</StatusBadge>
            : <StatusBadge tone="neutral" dot>Inactivo</StatusBadge>),
    },
    {
        key: "proId",
        header: "ID",
        sortable: true,
        numeric: true,
        align: "left",
        width: 80,
        render: (p) => <span className={ui.muted}>{p.proId}</span>,
    },
];

export default function ProfilesPage() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stateFilter, setStateFilter] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const navigate = useNavigate();
    const { user, hasActionPermission } = useAuth();
    const ownProfileId = user?.profile?.proId;

    const canCreate = hasActionPermission(MODULES.PROFILE, ACTIONS.CREATE);
    const canUpdate = hasActionPermission(MODULES.PROFILE, ACTIONS.UPDATE);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileRes, userRes] = await Promise.all([getAllProfiles(), getUsers()]);

            // Cantidad de usuarios por perfil (el endpoint de perfiles no la trae)
            const counts = new Map();
            unwrapList(userRes).forEach((u) => {
                const id = u.profile?.proId;
                if (id != null) counts.set(id, (counts.get(id) ?? 0) + 1);
            });

            setProfiles(unwrapList(profileRes).map((p) => ({
                ...p,
                proState: p.proState ?? "A",
                isDefault: p.isDefault ?? "N",
                hasControlAccess: p.hasControlAccess ?? "N",
                userCount: counts.get(p.proId) ?? 0,
            })));
        } catch (err) {
            setError(apiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setShowForm(true);
    };

    const openEdit = (profile) => {
        setEditing(profile);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
    };

    // Guarda y recarga; si falla, lanza y el FormDrawer muestra el error sin cerrarse.
    const handleSubmit = async (payload) => {
        if (editing) {
            await updateProfile(editing.proId, payload);
        } else {
            await createProfile(payload);
        }
        await load();
    };

    const goToAccess = (profile) => {
        navigate(`/dashboard/profiles/${profile.proId}/permissions`, {
            state: { profileName: profile.proName },
        });
    };

    const rows = profiles.filter((p) => !stateFilter || p.proState === stateFilter);

    return (
        <div className={ui.page}>

            <p className={ui.intro}>
                Cada usuario tiene un perfil, y el perfil decide qué secciones del panel ve y qué puede hacer en ellas.
                Para cambiar eso, entra a «Accesos».
            </p>

            {showForm && (
                <ProfileForm
                    key={editing?.proId ?? "new"}
                    initial={editing}
                    isOwnProfile={editing != null && editing.proId === ownProfileId}
                    onClose={closeForm}
                    onSubmit={handleSubmit}
                />
            )}

            <DataTable
                ariaLabel="Perfiles"
                columns={COLUMNS}
                rows={rows}
                rowKey={(p) => p.proId}
                loading={loading}
                error={error}
                onRetry={load}
                search={{ placeholder: "Buscar perfil por nombre", keys: ["proName"] }}
                filters={
                    <FilterSelect label="Filtrar por estado" allLabel="Todos los estados"
                        value={stateFilter} onChange={setStateFilter} options={STATE_OPTIONS} />
                }
                filtersActive={Boolean(stateFilter)}
                onClearFilters={() => setStateFilter("")}
                primaryAction={canCreate ? { label: "Nuevo perfil", icon: Plus, onClick: openCreate } : null}
                rowActions={(p) => [
                    { label: `Accesos de ${p.proName}`, icon: KeyRound, onClick: goToAccess, hidden: !canUpdate },
                    { label: "Editar", icon: Pencil, onClick: openEdit, hidden: !canUpdate },
                ]}
                defaultSort={{ key: "proName", dir: "asc" }}
                emptyState={{
                    title: "Todavía no hay perfiles",
                    description: "Crea uno y después configura sus accesos.",
                }}
            />
        </div>
    );
}
