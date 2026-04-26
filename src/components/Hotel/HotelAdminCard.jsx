import { useState } from "react";
import "../Hotel/HotelAdminCard.css";
import { Environment } from "../../Environments/Environment";

const HotelAdminCard = ({ hotel, onEdit, onDelete }) => {

  const images = hotel.imageUrls?.length
    ? hotel.imageUrls.map(url => Environment.API_URL_IMG + url)
    : [];

  const [current, setCurrent] = useState(0);
  const isActive = hotel.hotState === "A";

  const prev = (e) => {
    e.stopPropagation();
    setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = (e) => {
    e.stopPropagation();
    setCurrent(i => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <article className="hotel-card">

      {/* ── Imagen / Carrusel ── */}
      {images.length > 0 ? (
        <div className="hotel-card__carousel">
          <img
            className="hotel-card__img"
            src={images[current]}
            alt={`${hotel.hotName} ${current + 1}`}
          />

          {/* Flechas — solo si hay más de 1 imagen */}
          {images.length > 1 && (
            <>
              <button className="carousel-btn carousel-btn--prev" onClick={prev}>‹</button>
              <button className="carousel-btn carousel-btn--next" onClick={next}>›</button>

              {/* Dots */}
              <div className="carousel-dots">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`carousel-dot ${i === current ? "carousel-dot--active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  />
                ))}
              </div>

              {/* Contador */}
              <span className="carousel-counter">{current + 1} / {images.length}</span>
            </>
          )}
        </div>
      ) : (
        <div className="hotel-card__img-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      )}

      <div className="hotel-card__body">
        <h3 className="hotel-card__title">{hotel.hotName}</h3>
        <p className="hotel-card__desc">{hotel.hotDescription}</p>

        <div className="hotel-card__meta">
          <div className="hotel-card__meta-row">
            <div className="meta-item">
              <span className="meta-label">Dirección</span>
              <span className="meta-value">{hotel.hotAddress}</span>
            </div>
            <div className="meta-item" style={{ textAlign: "right" }}>
              <span className="meta-label">Ciudad</span>
              <span className="meta-value">{hotel.city?.citName || hotel.city?.citSec}</span>
            </div>
          </div>
          <div className="hotel-card__meta-row">
            <div className="meta-item">
              <span className="meta-label">Estado</span>
              <span className={isActive ? "badge-activo" : "badge-inactivo"}>
                {isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="meta-item" style={{ textAlign: "right" }}>
              <span className="meta-label">Costo/noche</span>
              <span className="meta-value">${hotel.hotCost}</span>
            </div>
          </div>
        </div>

        <div className="hotel-card__actions">
          <button className="btn btn-primary" onClick={onEdit}>Editar</button>
          <button className="btn btn-danger" onClick={onDelete}>Eliminar</button>
        </div>
      </div>
    </article>
  );
};

export default HotelAdminCard;