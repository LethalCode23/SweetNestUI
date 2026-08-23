import { useAuth } from "../../context/AuthContext";
import styles from "./CategoryCard.module.css";
import { MODULES, ACTIONS } from "../../constants/modules";

export const CategoryCard = ({ category, onEdit, onDelete }) => {

  const { catSec, catName, catEst } = category;
  const { hasActionPermission } = useAuth();

  return (
    <article className={styles["category-card"]}>
      <div className={styles["card-top"]}>
        <div>
          <h4 className={styles["category-name"]}>{catName}</h4>
          <p className={styles["category-id"]}>ID: <strong>{catSec}</strong></p>
        </div>
        <span className={`${styles["state-badge"]} ${catEst === "A" ? styles.active : styles.inactive}`}>
          {catEst === "A" ? "Activo" : "Inactivo"}
        </span>
      </div>
      <div className={styles["card-actions"]}>

        {hasActionPermission(MODULES.CATEGORIES, ACTIONS.UPDATE) && (
          <button className={`${styles.btn} ${styles["btn-primary"]}`} onClick={() => onEdit(category)}>Editar</button>
        )}

        {hasActionPermission(MODULES.CATEGORIES, ACTIONS.DELETE) && (
          <button className={`${styles.btn} ${styles["btn-danger"]}`} onClick={() => onDelete(category)}>Eliminar</button>
        )}

      </div>
    </article>
  );
};