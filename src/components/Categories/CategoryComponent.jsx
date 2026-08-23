import { useState, useEffect } from "react";
import { getAll, createCategory, updateCategory, deleteCategory } from "../../services/categoryServices/categoryService";
import { CategoryCard } from "../Categories/CategoryCard";
import { CategoryForm } from "../Categories/CategoryForm";
import categoryStyles from "./Category.module.css";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";

export const CategoryComponent = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { hasActionPermission } = useAuth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {

    setLoading(true);
    setError(null);

    try {

      const res = await getAll();
      res.sort((a, b) => String(a.catName).localeCompare(String(b.catName)));
      setData(res);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditing(category);
    setShowForm(true);
  };

  const handleDelete = async (category) => {

    if (!confirm(`¿Eliminar "${category.catName}"?`)) return;

    try {

      await deleteCategory(category.catSec);
      await load();

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (payload.catSec) {
        await updateCategory(payload);
      } else {
        await createCategory(payload);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className={categoryStyles["cn-loading"]}>Cargando...</div>;
  if (error) return <div className={categoryStyles["cn-error"]}>Error: {error}</div>;

  return (
    <div className={categoryStyles["country-wrapper"]}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Categorías</h3>

        {hasActionPermission(MODULES.CATEGORIES, ACTIONS.CREATE) && (

          <button className={`${categoryStyles.btn} ${categoryStyles["btn-primary"]}`} onClick={handleCreate}>
            Nueva categoría
          </button>
        )}
      </div>

      {showForm && (

        <CategoryForm

          initial={editing || {}}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {data.length === 0 ? (
        <div className={categoryStyles["cn-empty"]}>No hay categorías disponibles.</div>
      ) : (
        <div className={categoryStyles["categories-grid"]}>

          {data.map((c) => (

            <CategoryCard
              key={c.catSec}
              category={c}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
};