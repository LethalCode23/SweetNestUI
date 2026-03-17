import { useEffect, useState } from "react";
import { createCity, updateCity } from "../services/cityService";
import { getAll } from "../services/departmentService";
import "../styles/CityForm.css";

const initialState = {
  citName: "",
  department: "",
  citState: true,
};

const CityForm = ({ onSuccess, editingCity, setEditingCity, onClose }) => {
  const [form, setForm] = useState(initialState);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getAll().then(setDepartments);
  }, []);

  useEffect(() => {
    if (editingCity) {
      setForm({
        ...editingCity,
        department: editingCity.department?.depSec || "",
        citState: editingCity.citState === "A" || editingCity.citState === true,
      });
    } else {
      setForm(initialState);
    }
  }, [editingCity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const payload = {
      citName: form.citName,
      citState: form.citState ? "A" : "I",
      citDepSec: form.department ,
    };

    if (editingCity) {
      await updateCity(editingCity.citSec, payload);
      setEditingCity(null);
      if (onClose) onClose();
    } else {
      await createCity(payload);
      if (onClose) onClose();
    }
    
    setForm(initialState);
    onSuccess();
  };

  return (
    <form className="city-form" onSubmit={handleSubmit}>
      <label htmlFor="citName">Nombre de la ciudad</label>
      <input
        id="citName"
        type="text"
        name="citName"
        value={form.citName}
        onChange={handleChange}
        required
      />
      <label htmlFor="department">Departamento</label>
      <select id="department" name="department" value={form.department} onChange={handleChange} required>
        <option value="">Selecciona un departamento</option>
        {departments.map((dep) => (
          <option key={dep.depSec} value={dep.depSec}>{dep.depName}</option>
        ))}
      </select>
      <label className="city-state-label">
        <input
          type="checkbox"
          name="citState"
          checked={form.citState}
          onChange={handleChange}
        />
        Activo
      </label>
      <button type="submit">{editingCity ? "Actualizar" : "Crear"} Ciudad</button>
      {editingCity && (
        <button type="button" onClick={() => setEditingCity(null)}>
          Cancelar edición
        </button>
      )}
    </form>
  );
};

export default CityForm;
