import { useState, useEffect } from "react";
import { getAll as getCountries } from "../../services/countryServices/countryService";

export const DepartmentForm = ({ initial = {}, onCancel, onSubmit }) => {
  const [form, setForm] = useState({ depName: "", depState: "A", depSec: null, depPaiSec: null });
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (initial) {
      setForm({ depName: initial.depName || "", depState: initial.depState || "A", depSec: initial.depSec || null, depPaiSec: initial.pais?.paiSec || initial.depPaiSec || null });
    }
    loadCountries();
  }, [initial]);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res);
    } catch (err) {
      console.error(err);
      setCountries([]);
    }
  };

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.depName.trim()) return alert("Nombre requerido");

    const payload = {
      // depSec: form.depSec,
      depName: form.depName,
      depState: form.depState,
      // depPaiSec: Number(form.depPaiSec)
      countryResponseDto: {
        paiSec: Number(form.depPaiSec),
        paiName: "" // si el backend no lo usa para guardar, puedes mandarlo vacío
      }
    };

    onSubmit(payload);
  };

  return (
    <form className="country-form" onSubmit={submit}>
      <div className="form-row">
        <label>Nombre</label>
        <input name="depName" value={form.depName} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>País</label>
        <select name="depPaiSec" value={form.depPaiSec || ""} onChange={handleChange}>
          <option value="">-- seleccionar --</option>
          {countries.map((c) => (
            <option key={c.paiSec} value={c.paiSec}>{c.paiName}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Estado</label>
        <select name="depState" value={form.depState} onChange={handleChange}>
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