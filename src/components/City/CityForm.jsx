import { useEffect, useState } from "react";
import { createCity, updateCity } from "../../services/cityServices/cityService";
import { getAll } from "../../services/departmentServices/departmentService";
import styles from "./CityForm.module.css";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";

const CityForm = ({ editingCity, onSuccess, onClose }) => {

  const { hasActionPermission } = useAuth();

  const [form, setForm] = useState(() => ({
    citName: editingCity?.citName || "",
    department: editingCity?.department?.depSec || "",
    citState: editingCity?.citState === "A" || editingCity?.citState === true ? "A" : "I",
  }));

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    let active = true;
    getAll()
      .then((res) => { if (active) setDepartments(res); })
      .catch(() => { if (active) setDepartments([]); });
    return () => { active = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      citName: form.citName,
      citState: form.citState,
      citDepSec: form.department,
    };

    if (editingCity) {
      await updateCity(editingCity.citSec, payload);
    } else {
      await createCity(payload);
    }

    await onSuccess();
    onClose();
  };

  const isEditing = Boolean(editingCity);
  const canSave = isEditing
    ? hasActionPermission(MODULES.CITIES, ACTIONS.UPDATE)
    : hasActionPermission(MODULES.CITIES, ACTIONS.CREATE);

  return (
    <form className={styles["city-form"]} onSubmit={handleSubmit}>
      <div className={styles["form-row"]}>
        <label htmlFor="citName">Nombre de la ciudad</label>
        <input
          id="citName"
          type="text"
          name="citName"
          value={form.citName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles["form-row"]}>
        <label htmlFor="department">Departamento</label>
        <select id="department" name="department" value={form.department} onChange={handleChange} required>
          <option value="">Selecciona un departamento</option>
          {departments.map((dep) => (
            <option key={dep.depSec} value={dep.depSec}>{dep.depName}</option>
          ))}
        </select>
      </div>

      <div className={styles["form-row"]}>
        <label htmlFor="citState">Estado</label>
        <select id="citState" name="citState" value={form.citState} onChange={handleChange}>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>

      <div className={styles["form-actions"]}>
        {canSave && (
          <button type="submit" className={`${styles.btn} ${styles["btn-primary"]}`}>Guardar</button>
        )}
        <button type="button" className={`${styles.btn} ${styles["btn-cancel"]}`} onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
};

export default CityForm;
