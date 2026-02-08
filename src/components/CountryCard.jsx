export const CountryCard = ({ country, onEdit, onDelete }) => {
  const { paiSec, paiName, paiState } = country;
  return (
    <article className="country-card" key={paiSec}>
      <div className="country-actions left">
        <button className="btn btn-primary" onClick={() => onEdit(country)}>
          Editar
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(country)}>
          Eliminar
        </button>
      </div>

      <div className="card-main">
        <div className="card-header">
          <h4 className="country-name">{paiName}</h4>
        </div>

        <div className="card-body">
          <p>
            ID: <strong>{paiSec}</strong>
          </p>
        </div>
      </div>

      <div className="badge-wrap">
        <span className={`state-badge ${paiState === "A" ? "active" : "inactive"}`}>
          {paiState === "A" ? "Activo" : "Inactivo"}
        </span>
      </div>
    </article>
  );
};
