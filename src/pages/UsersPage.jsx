import { useEffect, useState, useMemo } from "react";
import { getUsers, deleteUser } from "../services/userServices/userService";
import UserCard from "../components/User/UserCard";
import UserForm from "../components/User/UserForm";
import styles from "./UsersPage.module.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrado por búsqueda
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.profile?.proName?.toLowerCase().includes(q)
    );
  }, [users, search]);

  // Estadísticas
  const totalUsers  = users.length;
  const activeCount = users.filter((u) => u.profile?.proState === "A").length;
  const adminCount  = users.filter((u) => u.profile?.proId === 1).length;

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteRequest = (user) => setDeleteTarget(user);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteUser(deleteTarget.email);
    setDeleteTarget(null);
    fetchUsers();
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Usuarios</h1>
          <p className={styles.subtitle}>
            Administra los usuarios registrados en la plataforma
          </p>
        </div>
        <button
          className={styles.btnCreate}
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
        >
          ＋ Nuevo usuario
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar por nombre, email o perfil…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="user-search"
        />
      </div>

      {/* Stats */}
      {!loading && (
        <div className={styles.stats}>
          <span className={`${styles.statChip} ${styles.total}`}>
            👥 {totalUsers} total
          </span>
          <span className={`${styles.statChip} ${styles.active}`}>
            ✅ {activeCount} activos
          </span>
          <span className={`${styles.statChip} ${styles.admins}`}>
            ⬡ {adminCount} admins
          </span>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className={styles.skeleton}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👤</div>
          <p className={styles.emptyText}>
            {search ? "No se encontraron usuarios con esa búsqueda." : "No hay usuarios registrados."}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((user) => (
            <UserCard
              key={user.email}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* Formulario modal */}
      {showForm && (
        <UserForm
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          onSuccess={fetchUsers}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteTarget && (
        <div className={styles.deleteOverlay}>
          <div className={styles.deleteModal}>
            <div className={styles.deleteIcon}>🗑️</div>
            <h3 className={styles.deleteTitle}>¿Eliminar usuario?</h3>
            <p className={styles.deleteDesc}>
              Esta acción no se puede deshacer. Se eliminará a{" "}
              <span className={styles.deleteName}>
                {deleteTarget.firstName} {deleteTarget.lastName}
              </span>
              .
            </p>
            <div className={styles.deleteActions}>
              <button
                className={styles.deleteCancel}
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button
                className={styles.deleteConfirm}
                onClick={handleDeleteConfirm}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
