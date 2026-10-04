import { useAuth } from "../../context/AuthContext";
import styles from "./FeatureCard.module.css";
import { MODULES, ACTIONS } from "../../constants/modules";

export const FeatureCard = ({ feature, onEdit, onDelete }) => {
  const { hasActionPermission } = useAuth();

  const id = feature?.id ?? feature?.feaSec ?? "-";
  const name = feature?.name ?? feature?.feaName ?? "Sin Nombre";
  const state = feature?.state ?? feature?.feaState ?? "A";
  const icon = feature?.icon ?? feature?.feaIcon ?? "";

  const isActive = state === "A" || state === true || state === "ACTIVE";

  const canUpdate =
    hasActionPermission(MODULES.FEATURES, ACTIONS.UPDATE) ||
    hasActionPermission("Features", ACTIONS.UPDATE);

  const canDelete =
    hasActionPermission(MODULES.FEATURES, ACTIONS.DELETE) ||
    hasActionPermission("Features", ACTIONS.DELETE);

  return (
    <article className={styles["feature-card"]}>
      <div className={styles["card-top"]}>
        <div>
          <div className={styles["card-title"]}>
            {icon && <span className={styles["feature-icon"]}>{icon}</span>}
            <h4 className={styles["feature-name"]}>{name}</h4>
          </div>
          <p className={styles["feature-id"]}>ID: <strong>#{id}</strong></p>
        </div>
        <span className={`${styles["state-badge"]} ${isActive ? styles.active : styles.inactive}`}>
          {isActive ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className={styles["card-actions"]}>
        {canUpdate && (
          <button
            className={`${styles.btn} ${styles["btn-primary"]}`}
            onClick={() => onEdit(feature)}
            title="Editar característica"
            aria-label={`Editar ${name}`}
          >
            Editar
          </button>
        )}

        {canDelete && (
          <button
            className={`${styles.btn} ${styles["btn-danger"]}`}
            onClick={() => onDelete(feature)}
            title="Eliminar característica"
            aria-label={`Eliminar ${name}`}
          >
            Eliminar
          </button>
        )}
      </div>
    </article>
  );
};
