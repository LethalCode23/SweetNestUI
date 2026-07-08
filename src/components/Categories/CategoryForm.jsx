import { useState, useEffect } from "react";

export const CategoryForm = ({ initial = {}, onCancel, onSubmit }) => {
  const [form, setForm] = useState({ catName: "", catEst: "A", catSec: null });

  useEffect(() => {
    if (initial) setForm({ catName: initial.catName || "", catEst: initial.catEst || "A", catSec: initial.catSec || null });
  }, [initial]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.catName.trim()) return alert("Nombre requerido");
    onSubmit(form);
  };

  return (
    <form className="country-form" onSubmit={submit}>
      <div className="form-row">
        <label>Nombre</label>
        <input name="catName" value={form.catName} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Estado</label>
        <select name="catEst" value={form.catEst} onChange={handleChange}>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Guardar</button>
        <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};