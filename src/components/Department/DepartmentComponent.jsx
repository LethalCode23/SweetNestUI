import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import styles from "./DepartmentPage.module.css";
import { getAll, createDepartment, updateDepartment, deleteDepartment } from "../../services/departmentServices/departmentService";
import { DepartmentCard } from "../Department/DepartmentCard";
import { DepartmentForm } from "../Department/DepartmentForm";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";

export const DepartmentComponent = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { hasActionPermission } = useAuth();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try { const res = await getAll(); setData(res); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleCreate = () => { setEditing(null); setShowForm(true); };
  const handleEdit = (d) => { setEditing(d); setShowForm(true); };
  const handleDelete = async (d) => { if (!confirm(`Eliminar ${d.depName}?`)) return; try { await deleteDepartment(d.depSec); await load(); } catch (err) { alert(err.message); } };

  const handleSubmit = async (payload) => {
    try {
      if (payload.depSec) await updateDepartment(payload);
      else await createDepartment(payload);
      setShowForm(false); setEditing(null); await load();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className={styles["cn-loading"]}>Cargando...</div>;
  if (error) return <div className={styles["cn-error"]}>Error: {error}</div>;

  return (

    <div className={styles["departments-page"]}>

      <div className={styles["page-header"]}>
        <div>
          <h1 className={styles["page-title"]}>Departamentos</h1>
          <p className={styles["page-subtitle"]}>Gestión de los departamentos de cada país</p>
        </div>

        {hasActionPermission(MODULES.DEPARTMENTS, ACTIONS.CREATE) && (

          <button className="btn-primary" onClick={handleCreate}>
            <Plus size={15} style={{ marginRight: 6 }} />
            Nuevo departamento
          </button>
        )}
      </div>

      {showForm && <DepartmentForm key={editing?.depSec ?? "new"} initial={editing || {}} onCancel={() => { setShowForm(false); setEditing(null); }} onSubmit={handleSubmit} />}

      {data.length === 0 ? <div className={styles["cn-empty"]}>No hay departamentos disponibles.</div> : (
        <div className={styles["departments-grid"]}>
          {
            data.map((d) => <DepartmentCard key={d.depSec} department={d} onEdit={handleEdit} onDelete={handleDelete} />)
          }
        </div>
      )}
    </div>
  );
};