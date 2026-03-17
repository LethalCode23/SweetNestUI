import React, { useEffect, useState } from "react";
import { createHotel, updateHotel } from "../services/hotelService";
import { getCities } from "../services/cityService";
import "../styles/HotelForm.css";

const initialState = {
  hotName: "",
  hotDescription: "",
  hotAddress: "",
  hotCost: 0,
  city: "",
  hotState: true,
  hotImgUrl: "",
};

const HotelForm = ({ onSuccess, editingHotel, setEditingHotel, onClose }) => {
  const [form, setForm] = useState(initialState);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getCities().then(setCities);
  }, []);

  useEffect(() => {
    if (editingHotel) {
      setForm({
        ...editingHotel,
        city: editingHotel.city?.citSec || "",
        hotState: editingHotel.hotState === "A" || editingHotel.hotState === true,
      });
    } else {
      setForm(initialState);
    }
  }, [editingHotel]);

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
      ...form,
      hotState: form.hotState ? "A" : "I",
      hotCitSec: form.city
    };
    if (editingHotel) {
      await updateHotel(editingHotel.hotSec, payload);
      setEditingHotel(null);
      if (onClose) onClose();
    } else {
      await createHotel(payload);
      if (onClose) onClose();
    }
    setForm(initialState);
    onSuccess();
  };

  return (
    <form className="hotel-form" onSubmit={handleSubmit}>
      <label htmlFor="hotName">Nombre del hotel</label>
      <input
        id="hotName"
        type="text"
        name="hotName"
        value={form.hotName}
        onChange={handleChange}
        required
      />
      <label htmlFor="hotDescription">Descripción</label>
      <textarea
        id="hotDescription"
        name="hotDescription"
        value={form.hotDescription}
        onChange={handleChange}
        required
      />
      <label htmlFor="hotAddress">Dirección</label>
      <input
        id="hotAddress"
        type="text"
        name="hotAddress"
        value={form.hotAddress}
        onChange={handleChange}
        required
      />
      <label htmlFor="hotCost">Costo</label>
      <input
        id="hotCost"
        type="number"
        name="hotCost"
        value={form.hotCost}
        onChange={handleChange}
        required
        min={0}
      />
      <label htmlFor="city">Ciudad</label>
      <select id="city" name="city" value={form.city} onChange={handleChange} required>
        <option value="">Selecciona una ciudad</option>
        {cities.map((city) => (
          <option key={city.citSec} value={city.citSec}>
            {city.citName}
          </option>
        ))}
      </select>
      <label className="hotel-state-label">
        <input
          type="checkbox"
          name="hotState"
          checked={form.hotState}
          onChange={handleChange}
        />
        Activo
      </label>
      <label htmlFor="hotImgUrl">URL de la imagen</label>
      <input
        id="hotImgUrl"
        type="text"
        name="hotImgUrl"
        value={form.hotImgUrl}
        onChange={handleChange}
      />
      <button type="submit">{editingHotel ? "Actualizar" : "Registrar"}</button>
      {editingHotel && (
        <button type="button" onClick={() => setEditingHotel(null)}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default HotelForm;