import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { getUsers, deleteUser } from "../services/userServices/userService";
import UserForm from "../components/User/UserForm";
import ui from "../components/ui/catalog.module.css";
import styles from "./UsersPage.module.css";
import { MODULES, ACTIONS } from "../constants/modules";
import { useAuth } from "../context/AuthContext";
import { DataTable } from "../components/ui/DataTable/DataTable";
import { StatusBadge } from "../components/ui/StatusBadge/StatusBadge";
import { ConfirmDialog } from "../components/ui/ConfirmDialog/ConfirmDialog";
import { useConfirmDelete } from "../components/ui/ConfirmDialog/useConfirmDelete";
import { FilterSelect } from "../components/ui/FilterSelect/FilterSelect";
import { optionsFrom } from "../components/ui/FilterSelect/options";
import { apiErrorMessage, unwrapList } from "../Utils/apiError";

const HOST_OPTIONS = [
  { value: "S", label: "Anfitriones" },
  { value: "N", label: "No anfitriones" },
];

const initials = (u) => `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase() || "?";

const COLUMNS = [
  {
    key: "fullName",
    header: "Usuario",
    sortable: true,
    render: (u) => (
      <span className={styles.user}>
        <span className={styles.avatar} aria-hidden="true">{initials(u)}</span>
        <span className={ui.stack}>
          <span className={ui.name}>{u.fullName}</span>
          <span className={ui.stackSub}>{u.email}</span>
        </span>
      </span>
    ),
  },
  {
    key: "proName",
    header: "Perfil",
    sortable: true,
    render: (u) =>
      u.proName ? <StatusBadge tone="neutral">{u.proName}</StatusBadge> : <span className={ui.empty}>Sin perfil</span>,
  },
  {
    key: "host",
    header: "Anfitrión",
    render: (u) => (u.host === "S" ? <StatusBadge tone="info">Anfitrión</StatusBadge> : <span className={ui.empty}>—</span>),
  },
  {
    key: "userSec",
    header: "ID",
    sortable: true,
    numeric: true,
    align: "left",
    width: 96,
    render: (u) => <span className={ui.muted}>{u.userSec}</span>,
  },
];

const UsersPage = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [profileFilter, setProfileFilter] = useState("");
  const [hostFilter, setHostFilter] = useState("");
  const { hasActionPermission } = useAuth();
  const navigate = useNavigate();

  const canCreate = hasActionPermission(MODULES.USERS, ACTIONS.CREATE);
  const canUpdate = hasActionPermission(MODULES.USERS, ACTIONS.UPDATE);
  const canDelete = hasActionPermission(MODULES.USERS, ACTIONS.DELETE);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Campos planos para que el DataTable busque y ordene por ellos
      setUsers(unwrapList(await getUsers()).map((u) => ({
        ...u,
        fullName: [u.firstName, u.lastName].filter(Boolean).join(" "),
        proName: u.profile?.proName ?? "",
        proId: u.profile?.proId ?? null,
      })));
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const del = useConfirmDelete({
    onDelete: (u) => deleteUser(u.userSec),
    onDone: fetchUsers,
    conflictMessage: "No se puede eliminar: el usuario tiene reservas u hoteles asociados.",
  });

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handlePermissions = (user) => {
    if (!user.proId) return;
    navigate(`/dashboard/profiles/${user.proId}/permissions`, {
      state: { profileName: user.proName || `Perfil ${user.proId}` },
    });
  };

  const profileOptions = optionsFrom(users, (u) => u.proId, (u) => u.proName);

  const rows = users.filter((u) =>
    (!profileFilter || String(u.proId) === profileFilter) &&
    (!hostFilter || (u.host ?? "N") === hostFilter)
  );

  return (
    <div className={ui.page}>

      <p className={ui.intro}>Personas con cuenta en SweetNest. El perfil define a qué secciones del panel pueden entrar.</p>

      <DataTable
        ariaLabel="Usuarios"
        columns={COLUMNS}
        rows={rows}
        rowKey={(u) => u.userSec ?? u.email}
        loading={loading}
        error={error}
        onRetry={fetchUsers}
        search={{ placeholder: "Buscar por nombre, email o perfil", keys: ["fullName", "email", "proName"] }}
        filters={
          <>
            <FilterSelect label="Filtrar por perfil" allLabel="Todos los perfiles"
              value={profileFilter} onChange={setProfileFilter} options={profileOptions} />
            <FilterSelect label="Filtrar por anfitrión" allLabel="Anfitrión: todos"
              value={hostFilter} onChange={setHostFilter} options={HOST_OPTIONS} />
          </>
        }
        filtersActive={Boolean(profileFilter || hostFilter)}
        onClearFilters={() => { setProfileFilter(""); setHostFilter(""); }}
        primaryAction={canCreate ? { label: "Nuevo usuario", icon: Plus, onClick: handleCreate } : null}
        rowActions={(u) => [
          {
            label: u.proId ? `Permisos de ${u.proName}` : "Sin perfil asignado",
            icon: KeyRound,
            onClick: handlePermissions,
            disabled: !u.proId,
          },
          { label: "Editar", icon: Pencil, onClick: handleEdit, hidden: !canUpdate },
          { label: "Eliminar", icon: Trash2, onClick: del.request, tone: "danger", hidden: !canDelete },
        ]}
        defaultSort={{ key: "fullName", dir: "asc" }}
        emptyState={{
          title: "Todavía no hay usuarios",
          description: "Crea el primero y asígnale un perfil.",
        }}
      />

      {showForm && (
        <UserForm
          key={editingUser?.userSec ?? "new"}
          editingUser={editingUser}
          onSuccess={fetchUsers}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}

      <ConfirmDialog
        {...del.dialogProps}
        title={`¿Eliminar a ${del.target?.fullName || "este usuario"}?`}
        description="La persona pierde el acceso a SweetNest. Esta acción no se puede deshacer."
        confirmLabel="Eliminar usuario"
      />
    </div>
  );
};

export default UsersPage;
