import { useNavigate } from "react-router-dom";
import { KeyRound, Pencil, Trash2 } from "lucide-react";
import styles from "./UserCard.module.css";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules"

const initials = (firstName = "", lastName = "") =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

export default function UserCard({ user, onEdit, onDelete }) {

  const { hasActionPermission } = useAuth();
  const navigate = useNavigate();
  const isActive = user.profile?.proState === "A";
  const profileId = user.profile?.proId;

  const handlePermissions = () => {
    if (profileId) {
      navigate(`/dashboard/profiles/${profileId}/permissions`, {
        state: { profileName: user.profile?.proName ?? `Perfil ${profileId}` },
      });
    }
  };

  return (
    <article className={styles.card}>

      <div className={styles.left}>
        <div className={styles.avatar}>{initials(user.firstName, user.lastName)}</div>
        <div className={styles.info}>
          <p className={styles.name}>
            {user.firstName} {user.lastName}
          </p>
          <p className={styles.email}>{user.email}</p>
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.profileBadge}>{user.profile?.proName ?? "Sin perfil"}</span>

        <span className={`${styles.stateDot} ${isActive ? styles.active : styles.inactive}`} />

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionBtn}
            title={profileId ? `Ver permisos (${user.profile?.proName})` : "Sin perfil asignado"}
            disabled={!profileId}
            onClick={handlePermissions}
          >
            <KeyRound size={15} />
          </button>

          {hasActionPermission(MODULES.USERS, ACTIONS.UPDATE) && (
            <button
              type="button"
              className={styles.actionBtn}
              title="Editar usuario"
              onClick={() => onEdit(user)}
            >
              <Pencil size={15} />
            </button>
          )}

          {hasActionPermission(MODULES.USERS, ACTIONS.DELETE) && (
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.danger}`}
              title="Eliminar usuario"
              onClick={() => onDelete(user)}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}