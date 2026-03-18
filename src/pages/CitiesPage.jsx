import { useEffect, useState } from "react";
import CityForm from "../components/City/CityForm";
import CityCard from "../components/City/CityCard";
import { getCities, createCity, updateCity, deleteCity } from "../services/cityService";
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
      <h2>Ciudades</h2>
      {!showForm && !editingCity && (
        <button onClick={() => setShowForm(true)} style={{marginBottom: '18px'}}>Crear nueva ciudad</button>
      )}
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
            <button onClick={() => setShowForm(false)} style={{marginTop: '8px'}}>Cancelar</button>
          )}
        </>
      )}
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
              if(window.confirm('¿Eliminar ciudad?')) {
                await deleteCity(city.citSec);
                fetchCities();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CitiesPage;
