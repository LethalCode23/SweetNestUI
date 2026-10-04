import { useAuth } from "../../context/AuthContext";
import styles from "./CityCard.module.css";
import { MODULES, ACTIONS } from "../../constants/modules";

const CityCard = ({ city, onEdit, onDelete }) => {

  const { hasActionPermission } = useAuth();
  const { citName, citState, department } = city;
  const departmentName = department?.depName || department?.depSec || '—';

  return (
    <article className={styles["city-card"]}>
      <div className={styles["card-top"]}>
        <div>
          <h4 className={styles["city-name"]}>{citName}</h4>
          <p className={styles["city-department"]}>Departamento: <strong>{departmentName}</strong></p>
        </div>
        <span className={`${styles["state-badge"]} ${citState === "A" ? styles.active : styles.inactive}`}>
          {citState === "A" ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className={styles["card-actions"]}>

        {hasActionPermission(MODULES.CITIES, ACTIONS.UPDATE) && (
          <button className={`${styles.btn} ${styles["btn-primary"]}`} onClick={() => onEdit(city)} aria-label={`Editar ${citName}`}>Editar</button>
        )}

        {hasActionPermission(MODULES.CITIES, ACTIONS.DELETE) && (
          <button className={`${styles.btn} ${styles["btn-danger"]}`} onClick={() => onDelete(city)} aria-label={`Eliminar ${citName}`}>Eliminar</button>
        )}

      </div>
    </article>
  );
};

export default CityCard;
