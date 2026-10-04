import { useAuth } from "../../context/AuthContext";
import styles from "./CountryCard.module.css";
import { MODULES, ACTIONS } from "../../constants/modules";

export const CountryCard = ({ country, onEdit, onDelete }) => {

  const { hasActionPermission } = useAuth();
  const { paiSec, paiName, paiState } = country;

  return (
    <article className={styles["country-card"]}>
      <div className={styles["card-top"]}>
        <div>
          <h4 className={styles["country-name"]}>{paiName}</h4>
          <p className={styles["country-id"]}>ID: <strong>{paiSec}</strong></p>
        </div>
        <span className={`${styles["state-badge"]} ${paiState === "A" ? styles.active : styles.inactive}`}>
          {paiState === "A" ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className={styles["card-actions"]}>

        {hasActionPermission(MODULES.COUNTRIES, ACTIONS.UPDATE) && (
          <button className={`${styles.btn} ${styles["btn-primary"]}`} onClick={() => onEdit(country)}>Editar</button>
        )}

        {hasActionPermission(MODULES.COUNTRIES, ACTIONS.DELETE) && (
          <button className={`${styles.btn} ${styles["btn-danger"]}`} onClick={() => onDelete(country)}>Eliminar</button>
        )}

      </div>
    </article>
  );
};
