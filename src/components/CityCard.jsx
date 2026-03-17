import React from "react";
import "../styles/CitiesCrudList.css";

const CityCard = ({ city, onEdit, onDelete }) => {
  return (
    <article className="country-card" key={city.citSec}>
      <div className="country-actions left">
        <button className="btn btn-primary" onClick={() => onEdit(city)}>
          Editar
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(city)}>
          Eliminar
        </button>
      </div>
      <div className="card-main">
        <h4 className="country-name">{city.citName}</h4>
        <div className="card-body">
          <p>Departamento: <strong>{city.department?.depName || city.department?.depSec}</strong></p>
        </div>
      </div>
      <div className="badge-wrap">
        <span className={`state-badge ${city.citState === "A" ? "active" : "inactive"}`}>
          {city.citState === "A" ? "Activo" : "Inactivo"}
        </span>
      </div>
    </article>
  );
};

export default CityCard;
