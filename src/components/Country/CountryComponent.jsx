import { useState, useEffect } from "react";
import "../Country/CountryComponent.css";
import { getAll, createCountry, updateCountry, deleteCountry } from "../../services/countryServices/countryService";
import { CountryCard } from "../Country/CountryCard";
import { CountryForm } from "../Country/CountryForm";

export const CountryComponent = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAll();
      // Aseguramos un orden consistente por nombre, como en departamentos
      res.sort((a, b) => String(a.paiName).localeCompare(String(b.paiName)));
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

  const handleEdit = (country) => {
    setEditing(country);
    setShowForm(true);
  };

  const handleDelete = async (country) => {
    if (!confirm(`Eliminar ${country.paiName}?`)) return;
    try {
      await deleteCountry(country.paiSec);
      await load();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (payload.paiSec) {
        await updateCountry(payload);
      } else {
        await createCountry(payload);
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="cn-loading">Cargando...</div>;
  if (error) return <div className="cn-error">Error: {error}</div>;

  return (
    
    <div className="country-wrapper">

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Países</h3>
        <div>
          <button className="btn btn-primary" onClick={handleCreate}>Nuevo país</button>
        </div>
      </div>

      {showForm && (
        <CountryForm initial={editing || {}} onCancel={() => { setShowForm(false); setEditing(null); }} onSubmit={handleSubmit} />
      )}

      {data.length === 0 ? (
        <div className="cn-empty">No hay países disponibles.</div>
      ) : (
        <div className="country-grid">
          {data.map((c) => (
            <CountryCard key={c.paiSec} country={c} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};