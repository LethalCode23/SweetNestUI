import { useState, useEffect } from "react";
import styles from "./DepartmentForm.module.css";
import { getAll as getCountries } from "../../services/countryServices/countryService";

export const DepartmentForm = ({ initial = {}, onCancel, onSubmit }) => {
  const [form, setForm] = useState(() => ({
    depName: initial.depName || "",
    depState: initial.depState || "A",
    depSec: initial.depSec ?? null,
    depPaiSec: initial.pais?.paiSec || initial.depPaiSec || null,
  }));
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    let active = true;
    getCountries()
      .then((res) => { if (active) setCountries(res); })
      .catch(() => { if (active) setCountries([]); });
    return () => { active = false; };
  }, []);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.depName.trim()) return alert("Nombre requerido");

    const payload = {
      depSec: form.depSec,
      depName: form.depName,
      depState: form.depState,
      countryResponseDto: {
        paiSec: Number(form.depPaiSec),
        paiName: "" // si el backend no lo usa para guardar, puedes mandarlo vacío
      }
    };

    onSubmit(payload);
  };

  return (
    <form className={styles["department-form"]} onSubmit={submit}>
      <div className={styles["form-row"]}>
        <label>Nombre</label>
        <input name="depName" value={form.depName} onChange={handleChange} />
      </div>

      <div className={styles["form-row"]}>
        <label>País</label>
        <select name="depPaiSec" value={form.depPaiSec || ""} onChange={handleChange}>
          <option value="">-- seleccionar --</option>
          {countries.map((c) => (
            <option key={c.paiSec} value={c.paiSec}>{c.paiName}</option>
          ))}
        </select>
      </div>

      <div className={styles["form-row"]}>
        <label>Estado</label>
        <select name="depState" value={form.depState} onChange={handleChange}>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>

      <div className={styles["form-actions"]}>
        <button type="submit" className={`${styles.btn} ${styles["btn-primary"]}`}>Guardar</button>
        <button type="button" className={`${styles.btn} ${styles["btn-cancel"]}`} onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};