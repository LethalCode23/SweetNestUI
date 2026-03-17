import React from "react";
import "../styles/HotelAdminCard.css";

const HotelAdminCard = ({ hotel, onEdit, onDelete }) => {
  const image = hotel.hotImgUrl ? hotel.hotImgUrl : "/hotel-placeholder.svg";
  return (
    <article className="hotel-admin-card">
      <div className="hotel-admin-img">
        <img src={image} alt={hotel.hotName} />
      </div>
      <div className="hotel-admin-info">
        <h3 className="hotel-admin-title">{hotel.hotName}</h3>
        <p className="hotel-admin-desc">{hotel.hotDescription}</p>
        <div className="hotel-admin-meta">
          <span>Dirección: {hotel.hotAddress}</span>
          <span>Ciudad: {hotel.city?.citName || hotel.city?.citSec}</span>
          <span>Estado: {hotel.hotState === "A" ? "Activo" : "Inactivo"}</span>
          <span>Costo: ${hotel.hotCost}</span>
        </div>
        <div className="hotel-admin-actions">
          <button className="btn btn-primary" onClick={onEdit}>Editar</button>
          <button className="btn btn-danger" onClick={onDelete}>Eliminar</button>
        </div>
      </div>
    </article>
  );
};

export default HotelAdminCard;
