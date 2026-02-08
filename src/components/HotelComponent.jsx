import { useState, useEffect } from "react";
import { getAll } from "../services/hotelService";
import { HotelCard } from "./HotelCard";
import "../styles/HotelComponent.css";

export const HotelComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getAll();
      setData(res);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleSearch = () => {
    // Placeholder: por ahora solo imprimimos los criterios.
    console.log('Buscar hoteles:', { city, date });
  };

  if (loading) return <div className="cn-loading">Cargando hoteles...</div>;
  if (error) return <div className="cn-error">Error: {error}</div>;

  return (
    <div className="hotel-wrapper">
      <div className="hotel-header">
        <h2 className="hotel-title">Busca Ofertas en Hoteles</h2>
        <div className="hotel-search">
          <input
            className="search-input city-input"
            type="text"
            placeholder="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Buscar por ciudad"
          />
          <input
            className="search-input date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Fecha de llegada"
          />
          <button className="btn btn-primary search-btn" onClick={handleSearch}>Buscar</button>
        </div>
      </div>

      <div className="hoteles">
        {data.length === 0 ? (
          <div className="cn-empty">No hay hoteles disponibles.</div>
        ) : (
          <div className="hotel-grid">
            {data.map(h => <HotelCard key={h.hotSec} hotel={h} />)}
          </div>
        )}
      </div>
    </div>
  );
};
