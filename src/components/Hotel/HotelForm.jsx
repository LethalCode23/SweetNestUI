import { useEffect, useState } from "react";
import { createHotel, updateHotel, uploadHotelImage } from "../../services/hotelServices/hotelService";
import { getCities } from "../../services/cityServices/cityService";
import styles from "./HotelForm.module.css";

const initialState = {
  hotName: "",
  hotDescription: "",
  hotAddress: "",
  hotCost: 0,
  city: "",
  hotState: true,
};

const HotelForm = ({ onSuccess, editingHotel, setEditingHotel, onClose }) => {

  const [form, setForm] = useState(initialState);
  const [cities, setCities] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

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
      setImageFiles([]);
      setPreviews([]);
    }
  }, [editingHotel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setUploading(true);

    try {

      const payload = {
        ...form,
        hotState: form.hotState ? "A" : "I",
        hotCitSec: form.city,
      };

      if (editingHotel) {

        await updateHotel(editingHotel.hotSec, payload);

        for (let i = 0; i < imageFiles.length; i++) {
          await uploadHotelImage(editingHotel.hotSec, i + 1, imageFiles[i]);
        }

        setEditingHotel(null);
        if (onClose) onClose();

      } else {

        const created = await createHotel(payload);
        for (let i = 0; i < imageFiles.length; i++) {
          await uploadHotelImage(created.hotSec, i + 1, imageFiles[i]);
        }

        if (onClose) onClose();
      }

      setForm(initialState);
      setImageFiles([]);
      setPreviews([]);
      onSuccess();
      
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.form}>
      <h3 className={styles.formTitle}>
        {editingHotel ? "Editar hotel" : "Registrar hotel"}
      </h3>

      <form onSubmit={handleSubmit} style={{ display: "contents" }}>
        <div className={styles.grid2}>

          {/* Nombre */}
          <div className={`${styles.field} ${styles.full}`}>
            <label className={styles.label}>Nombre del hotel</label>
            <input
              className={styles.input}
              type="text" name="hotName"
              placeholder="Ej. Grand Palace Bogotá"
              value={form.hotName} onChange={handleChange} required
            />
          </div>

          {/* Descripción */}
          <div className={`${styles.field} ${styles.full}`}>
            <label className={styles.label}>Descripción</label>
            <textarea
              className={styles.textarea}
              name="hotDescription"
              placeholder="Describe las características del hotel..."
              value={form.hotDescription} onChange={handleChange} required
            />
          </div>

          {/* Dirección */}
          <div className={`${styles.field} ${styles.full}`}>
            <label className={styles.label}>Dirección</label>
            <input
              className={styles.input}
              type="text" name="hotAddress"
              placeholder="Calle 123 # 45-67"
              value={form.hotAddress} onChange={handleChange} required
            />
          </div>

          {/* Costo */}
          <div className={styles.field}>
            <label className={styles.label}>Costo por noche</label>
            <input
              className={styles.input}
              type="number" name="hotCost"
              placeholder="0"
              value={form.hotCost} onChange={handleChange} required min={0}
            />
          </div>

          {/* Ciudad */}
          <div className={styles.field}>
            <label className={styles.label}>Ciudad</label>
            <select
              className={styles.select}
              name="city" value={form.city} onChange={handleChange} required
            >
              <option value="">Selecciona...</option>
              {cities.map((city) => (
                <option key={city.citSec} value={city.citSec}>{city.citName}</option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className={`${styles.field} ${styles.full}`}>
            <label className={styles.label}>Estado</label>
            <label className={styles.checkRow}>
              <input
                type="checkbox" className={styles.checkbox}
                name="hotState" checked={form.hotState} onChange={handleChange}
              />
              <span className={styles.checkLabel}>
                {form.hotState ? "Activo" : "Inactivo"}
              </span>
            </label>
          </div>

          {/* Upload de imágenes */}
          <div className={`${styles.field} ${styles.full}`}>
            <label className={styles.label}>Imágenes del hotel</label>
            <div className={styles.uploadZone}>
              <span className={styles.uploadIcon}>🖼</span>
              <p className={styles.uploadText}>
                <span>Selecciona archivos</span> o arrastra aquí
              </p>
              <span className={styles.uploadHint}>PNG, JPG, WEBP — múltiples permitidas</span>
              <input
                type="file" accept="image/*" multiple
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className={`${styles.field} ${styles.full}`}>
              <label className={styles.label}>{previews.length} imagen{previews.length > 1 ? "es" : ""} seleccionada{previews.length > 1 ? "s" : ""}</label>
              <div className={styles.previews}>
                {previews.map((src, i) => (
                  <div key={i} className={styles.previewItem}>
                    <img src={src} alt={`preview-${i}`} />
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeImage(i)}
                    >✕</button>
                    <span className={styles.priority}>#{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Acciones */}
        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={uploading}>
            {uploading ? "Guardando..." : editingHotel ? "Actualizar hotel" : "Registrar hotel"}
          </button>
          {editingHotel && (
            <button type="button" className={styles.cancelBtn} onClick={() => setEditingHotel(null)}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HotelForm;