export const DepartmentCard = ({ department, onEdit, onDelete }) => {
  const { depSec, depName, depState, pais, countryResponseDto } = department;
  const countryName = pais?.paiName || countryResponseDto?.paiName || '—';

  return (
    <article className="country-card" key={depSec}>
      <div className="country-actions left">
        <button className="btn btn-primary" onClick={() => onEdit(department)} aria-label={`Editar ${depName}`}>Editar</button>
        <button className="btn btn-danger" onClick={() => onDelete(department)} aria-label={`Eliminar ${depName}`}>Eliminar</button>
      </div>

      <div className="card-main">
        <h4 className="country-name">{depName}</h4>
        <div className="card-body">
          <p>País: <strong>{countryName}</strong></p>
          {/* <p>ID: <strong>{depSec}</strong></p> */}
        </div>
      </div>

      <div className="badge-wrap">
        <span className={`state-badge ${depState === "A" ? "active" : "inactive"}`}>
          {depState === "A" ? "Activo" : "Inactivo"}
        </span>
      </div>
    </article>
  );
};