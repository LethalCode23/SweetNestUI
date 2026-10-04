import { useAuth } from "../../context/AuthContext";
import styles from "./DepartmentCard.module.css";
import { MODULES, ACTIONS } from "../../constants/modules";

export const DepartmentCard = ({ department, onEdit, onDelete }) => {

  const { hasActionPermission } = useAuth();
  const { depName, depState, pais, countryResponseDto } = department;
  const countryName = pais?.paiName || countryResponseDto?.paiName || '—';

  return (
    <article className={styles["department-card"]}>
      <div className={styles["card-top"]}>
        <div>
          <h4 className={styles["department-name"]}>{depName}</h4>
          <p className={styles["department-country"]}>País: <strong>{countryName}</strong></p>
        </div>
        <span className={`${styles["state-badge"]} ${depState === "A" ? styles.active : styles.inactive}`}>
          {depState === "A" ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className={styles["card-actions"]}>

        {hasActionPermission(MODULES.DEPARTMENTS, ACTIONS.UPDATE) && (
          <button className={`${styles.btn} ${styles["btn-primary"]}`} onClick={() => onEdit(department)} aria-label={`Editar ${depName}`}>Editar</button>
        )}

        {hasActionPermission(MODULES.DEPARTMENTS, ACTIONS.DELETE) && (
          <button className={`${styles.btn} ${styles["btn-danger"]}`} onClick={() => onDelete(department)} aria-label={`Eliminar ${depName}`}>Eliminar</button>
        )}

      </div>
    </article>
  );
};
