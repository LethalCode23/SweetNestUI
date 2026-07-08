import styles from "./CategoryCard.module.css";

export const CategoryCard = ({ category, onEdit, onDelete }) => {
  const { catSec, catName, catEst } = category;

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
        <button className={`${styles.btn} ${styles["btn-primary"]}`} onClick={() => onEdit(category)}>Editar</button>
        <button className={`${styles.btn} ${styles["btn-danger"]}`} onClick={() => onDelete(category)}>Eliminar</button>
      </div>
    </article>
  );
};