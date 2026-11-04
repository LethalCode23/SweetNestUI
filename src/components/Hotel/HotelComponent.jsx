import { useState, useEffect } from "react";
import { getAll } from "../../services/hotelServices/hotelService";
import { HotelCard } from "../Hotel/HotelCard";
import { useNavigate } from "react-router-dom";
import "../Hotel/HotelComponent.css";
import { DestinationAutocomplete } from "./DestinationAutocomplete/DestinationAutocomplete";

const TODAY = new Date().toISOString().slice(0, 10);

export const HotelComponent = () => {

  const [page, setPage] = useState(0);
  const [city, setCity] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  const size = 10;
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    load();
  }, [page]);

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

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    // Si la salida elegida queda anterior a la nueva llegada, se limpia
    if (endDate && value && endDate < value) setEndDate('');
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearch = () => {

    const params = new URLSearchParams();
    if (city) params.append("citName", city);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    navigate(`/hoteles?${params.toString()}`);
  };

  // if (loading) return <div className="cn-loading">Cargando hoteles...</div>;
  // if (error) return <div className="cn-error">Error: {error}</div>;

  return (
    <div className="hotel-wrapper">

      <div className="hotel-header">
        <div className="header-dots" />
        <div className="header-content">

          <div className="header-pill">
            <span className="pill-dot" />
            Más de 1,200 hoteles disponibles
          </div>

          <h2 className="hotel-title">
            Encuentra tu <em>escape</em><br />perfecto hoy
          </h2>
          <p className="header-sub">
            Precios exclusivos · Sin cargos ocultos · Confirmación inmediata
          </p>

          <div className="hotel-search">
            <div className="search-field">
              <span className="field-label">Destino</span>
              <DestinationAutocomplete
                value={city}
                onChange={setCity}
                onSubmit={handleSearch}
                inputClassName="search-input city-input"
                placeholder="¿A dónde vas?"
                ariaLabel="Destino: ciudad u hotel"
              />
            </div>

            <div className="search-fields-group">
              <div className="search-field">
                <span className="field-label">Llegada</span>
                <input
                  className="search-input date-input"
                  type="date"
                  value={startDate}
                  min={TODAY}
                  onChange={handleStartDateChange}
                  aria-label="Fecha de llegada"
                />
              </div>
              <div className="search-field">
                <span className="field-label">Salida</span>
                <input
                  className="search-input date-input"
                  type="date"
                  value={endDate}
                  min={startDate || TODAY}
                  onChange={handleEndDateChange}
                  aria-label="Fecha de salida"
                />
              </div>
            </div>

            <button className="search-btn" onClick={handleSearch}>
              Buscar <span className="btn-arrow">→</span>
            </button>
          </div>

          <div className="header-stats">
            <div className="stat">
              <span className="stat-num">1.2K+</span>
              <span className="stat-lbl">Hoteles</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">48K</span>
              <span className="stat-lbl">Reservas</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">4.9★</span>
              <span className="stat-lbl">Valoración</span>
            </div>
          </div>

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
