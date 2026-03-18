import { useState, useEffect } from "react";

export const CountryForm = ({ initial = {}, onCancel, onSubmit }) => {
  const [form, setForm] = useState({ paiName: "", paiState: "A", paiSec: null });

  useEffect(() => {
    if (initial) setForm({ paiName: initial.paiName || "", paiState: initial.paiState || "A", paiSec: initial.paiSec || null });
  }, [initial]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.paiName.trim()) return alert("Nombre requerido");
    onSubmit(form);
  };

  return (
    <form className="country-form" onSubmit={submit}>
      <div className="form-row">
        <label>Nombre</label>
        <input name="paiName" value={form.paiName} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Estado</label>
        <select name="paiState" value={form.paiState} onChange={handleChange}>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};
