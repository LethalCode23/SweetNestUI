import { useState, useEffect } from "react";
import "../Country/CountryComponent.css";
import { getAll, createDepartment, updateDepartment, deleteDepartment } from "../../services/departmentService";
import { DepartmentCard } from "../Department/DepartmentCard";
import { DepartmentForm } from "../Department/DepartmentForm";

export const DepartmentComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

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

  if (loading) return <div className="cn-loading">Cargando...</div>;
  if (error) return <div className="cn-error">Error: {error}</div>;

  return (
    <div className="country-wrapper">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Departamentos</h3>
        <div><button className="btn btn-primary" onClick={handleCreate}>Nuevo departamento</button></div>
      </div>

      {showForm && <DepartmentForm initial={editing || {}} onCancel={() => { setShowForm(false); setEditing(null); }} onSubmit={handleSubmit} />}

      {data.length === 0 ? <div className="cn-empty">No hay departamentos disponibles.</div> : (
        <div className="country-grid">
          {
            data.map((d) => <DepartmentCard key={d.depSec} department={d} onEdit={handleEdit} onDelete={handleDelete} />)
          }
        </div>
      )}
    </div>
  );
};