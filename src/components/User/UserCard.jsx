import styles from "./UserCard.module.css";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";

const getInitials = (firstName = "", lastName = "") =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const UserCard = ({ user, onEdit, onDelete }) => {

  const { hasActionPermission } = useAuth();
  const initials = getInitials(user.firstName, user.lastName);
  const isAdmin = user.profile?.proId === 1 || user.profile?.proName?.toLowerCase().includes("admin");
  const isActive = user.profile?.proState === "A";

  return (
    <article className={styles.card}>
      {/* Avatar */}
      <div className={styles.avatar}>{initials}</div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.name}>
          {user.firstName} {user.lastName}
        </p>
        <p className={styles.email}>{user.email}</p>
        <span className={`${styles.profileBadge} ${isAdmin ? styles.admin : styles.user}`}>
          {isAdmin ? "⬡ Admin" : "◈ Usuario"}
        </span>
      </div>

      {/* Estado */}
      <span className={`${styles.stateBadge} ${isActive ? styles.active : styles.inactive}`}>
        {isActive ? "Activo" : "Inactivo"}
      </span>

      {/* Acciones */}
      <div className={styles.actions}>

        {hasActionPermission(MODULES.USERS, ACTIONS.UPDATE) && (
          <button className={styles.btnEdit} onClick={() => onEdit(user)}>
            ✏ Editar
          </button>
        )}

        {hasActionPermission(MODULES.USERS, ACTIONS.DELETE) && (
          <button className={styles.btnDelete} onClick={() => onDelete(user)}>
            🗑 Eliminar
          </button>
        )}
      </div>
    </article>
  );
};

export default UserCard;
