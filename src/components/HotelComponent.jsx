import { useState, useEffect } from "react";
import { getAll } from "../services/hotelService";
import { HotelCard } from "./HotelCard";
import "../styles/HotelComponent.css";

export const HotelComponent = () => {

  const [page, setPage] = useState(0);
  const [city, setCity] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  
  const size = 20;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState('');

  useEffect(() => { 
    load(); }, [page] );

  const load = async () => {

    setLoading(true); 
    setError(null);

    try {

      const res = await getAll(page, size, city);
      console.log('Hoteles cargados:', res);

      setData(res.content);
      setTotalPages(res.totalPages);

    } catch (err) { 
      console.log('Error al cargar hoteles:', err);
      setError(err.message);
    } finally { 
      setLoading(false); 
    }
  };

  const handleSearch = () => {
    // Placeholder: por ahora solo imprimimos los criterios.
    console.log('Buscar hoteles:', { city, date });
    setPage(0);
    load();
  };

  // if (loading) return <div className="cn-loading">Cargando hoteles...</div>;
  // if (error) return <div className="cn-error">Error: {error}</div>;

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
        <div className="pagination">
          <button className="btnLeft" 
            disabled={page === 0}
            onClick={() => setPage(prev => prev - 1)}
          >
            Anterior
          </button>

          <span>Página {page + 1} de {totalPages}</span>

          <button className="btnRight"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(prev => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};