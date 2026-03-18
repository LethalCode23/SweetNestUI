import { useState } from "react";
import { BASE_URL } from "../../Js/constants";

export const HotelCard = ({ hotel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [current, setCurrent] = useState(0);
  const [imgError, setImgError] = useState(false);

  const { hotName, hotDescription, hotAddress, hotCost, imageUrls } = hotel;

  const price = hotCost
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(hotCost / 1000)
    : null;

  const images = Array.isArray(imageUrls) && imageUrls.length > 0
    ? imageUrls.map(url => url.startsWith("http") ? url : `${BASE_URL}${url}`)
    : ["/hotel-placeholder.svg"];

  const nextImg = (e) => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length); };
  const prevImg = (e) => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); };

  return (
    <article className="hotel-card">
      <div
        className="hotel-media"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={imgError ? "/hotel-placeholder.svg" : images[current]}
          alt={hotName}
          loading="lazy"
          className="hotel-img"
          onError={() => setImgError(true)}
        />

        <button className="bookmark" aria-label="Guardar">🔖</button>

        {/* Carousel — solo si hay más de 1 imagen */}
        {images.length > 1 && (
          <div className={`hotel-carousel-controls${isHovered ? " visible" : ""}`}>
            <button onClick={prevImg} className="carousel-btn" aria-label="Anterior">◀</button>
            <div className="carousel-dots">
              {images.map((_, i) => (
                <div key={i} className={`dot${i === current ? " active" : ""}`} />
              ))}
            </div>
            <button onClick={nextImg} className="carousel-btn" aria-label="Siguiente">▶</button>
          </div>
        )}

        <div className="media-overlay">
          <h4 className="hotel-name">{hotName}</h4>
          {price && <span className="price-badge">{price}</span>}
        </div>
      </div>

      <div className="hotel-body">
        {hotDescription && <p className="hotel-desc">{hotDescription}</p>}

        <div className="hotel-meta">
          <span className="rating">
            <span className="rating-star">★</span> 4.7
          </span>
          <span className="tag">Nature Stay</span>
          <span className="tag">3 Day Escape</span>
        </div>

        <div className="hotel-footer">
          <span className="hotel-location">
            <span className="loc-icon">📍</span>
            {hotAddress}
          </span>
          <button className="btn-book">Book now</button>
        </div>
      </div>
    </article>
  );
};