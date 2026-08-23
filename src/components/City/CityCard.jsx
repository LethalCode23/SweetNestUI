import "../City/CitiesCrudList.css";
import { MODULES, ACTIONS } from "../../constants/modules";
import { useAuth } from "../../context/AuthContext";

const CityCard = ({ city, onEdit, onDelete }) => {

  const { hasActionPermission } = useAuth();

  return (
    <article className="country-card" key={city.citSec}>
      <div className="country-actions left">

        {hasActionPermission(MODULES.CITIES, ACTIONS.UPDATE) && (
          <button className="btn btn-primary" onClick={() => onEdit(city)}>
            Editar
          </button>
        )}

        {hasActionPermission(MODULES.CITIES, ACTIONS.DELETE) && (
          <button className="btn btn-danger" onClick={() => onDelete(city)}>
            Eliminar
          </button>
        )}

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