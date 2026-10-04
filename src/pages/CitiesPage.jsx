import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import CityForm from "../components/City/CityForm";
import CityCard from "../components/City/CityCard";
import { deleteCity, getCities } from "../services/cityServices/cityService";
import styles from "../components/City/CityPage.module.css";
import { useAuth } from "../context/AuthContext";
import { MODULES, ACTIONS } from "../constants/modules";

const CitiesPage = () => {

  const { hasActionPermission } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      setData(await getCities());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    let active = true;
    getCities()
      .then((res) => { if (active) setData(res); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleCreate = () => { setEditing(null); setShowForm(true); };

  const handleEdit = (city) => { setEditing(city); setShowForm(true); };

  const handleDelete = async (city) => {
    if (!confirm(`Eliminar ${city.citName}?`)) return;
    try {
      await deleteCity(city.citSec);
      await load();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className={styles["cn-loading"]}>Cargando...</div>;
  if (error) return <div className={styles["cn-error"]}>Error: {error}</div>;

  return (

    <div className={styles["cities-page"]}>

      <div className={styles["page-header"]}>
        <div>
          <h1 className={styles["page-title"]}>Ciudades</h1>
          <p className={styles["page-subtitle"]}>Gestión de las ciudades de cada departamento</p>
        </div>

        {hasActionPermission(MODULES.CITIES, ACTIONS.CREATE) && (

          <button className="btn-primary" onClick={handleCreate}>
            <Plus size={15} style={{ marginRight: 6 }} />
            Nueva ciudad
          </button>
        )}
      </div>

      {showForm && (
        <CityForm
          key={editing?.citSec ?? "new"}
          editingCity={editing}
          onSuccess={load}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {data.length === 0 ? (
        <div className={styles["cn-empty"]}>No hay ciudades disponibles.</div>
      ) : (
        <div className={styles["cities-grid"]}>
          {data.map((city) => (
            <CityCard
              key={city.citSec}
              city={city}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default CitiesPage;
