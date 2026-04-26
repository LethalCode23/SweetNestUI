import { useEffect, useState } from "react";
import CityForm from "../components/City/CityForm";
import CityCard from "../components/City/CityCard";
import { getCities, createCity, updateCity, deleteCity } from "../services/cityServices/cityService";
import "../components/City/CitiesCrudList.css";

const CitiesPage = () => {

  const [cities, setCities] = useState([]);
  const [editingCity, setEditingCity] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCities = async () => {
    const data = await getCities();
    setCities(data);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    
    <div className="cities-page">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Ciudades</h3>
        <div>
          {!showForm && !editingCity && (

            <button className="btn btn-primary" 
                onClick={() => setShowForm(true)} 
                style={{ marginBottom: '18px' }}>Crear nueva ciudad</button>
          )}
        </div>
      </div>

      {(showForm || editingCity) && (
        <>
          <CityForm
            onSuccess={fetchCities}
            editingCity={editingCity}
            setEditingCity={setEditingCity}
            onClose={() => {
              setShowForm(false);
              setEditingCity(null);
            }}
          />
          {!editingCity && (
            <button onClick={() => setShowForm(false)} style={{ marginTop: '8px' }}>Cancelar</button>
          )}
        </>
      )}

      {cities.length === 0 ? (
        <div className="cn-empty">No hay ciudades disponibles.</div>
      ) : (

        <div className="crud-city-list">
          {cities.map((city) => (
            <CityCard
              key={city.citSec}
              city={city}
              onEdit={() => {
                setEditingCity(city);
                setShowForm(true);
              }}
              onDelete={async () => {
                if (window.confirm('¿Eliminar ciudad?')) {
                  await deleteCity(city.citSec);
                  fetchCities();
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CitiesPage;
