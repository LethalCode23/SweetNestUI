/**
 * Select chico para la toolbar del DataTable. value "" = sin filtro.
 *   <FilterSelect label="Filtrar por estado" allLabel="Todos los estados"
 *                 value={v} onChange={setV} options={STATE_OPTIONS} />
 * STATE_OPTIONS vive en ./options.js (separado para no romper fast refresh).
 */
export const FilterSelect = ({ label, allLabel, value, onChange, options }) => (
  <select
    className="sn-select"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label={label}
  >
    <option value="">{allLabel}</option>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

export default FilterSelect;
