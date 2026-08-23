import { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { getHotels, deleteHotel, updateHotel, createHotel, uploadHotelImage } from "../../services/hotelServices/hotelService";
import { getCities } from "../../services/cityServices/cityService";
import { getAll as getCategories } from "../../services/categoryServices/categoryService";
import { BASE_URL } from "../../Js/constants";
import styles from "./HotelForm.module.css";

const INITIAL = {
  hotName: "",
  hotDescription: "",
  hotAddress: "",
  hotCost: "",
  city: "",
  hotState: true,
};

export default function HotelForm({ editingHotel, onSuccess, onClose }) {

  const [form, setForm] = useState(INITIAL);
  const [selectedCatIds, setSelectedCatIds] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [removedExistingImages, setRemovedExistingImages] = useState([]);

  useEffect(() => {
    getCities().then(setCities);
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {

    if (editingHotel) {

      console.log("Editing hotel:", editingHotel);
      setForm({
        hotName: editingHotel.hotName ?? "",
        hotDescription: editingHotel.hotDescription ?? "",
        hotAddress: editingHotel.hotAddress ?? "",
        hotCost: editingHotel.hotCost ?? "",
        city: editingHotel.city?.citSec ?? editingHotel.hotCitSec ?? "",
        hotState: editingHotel.hotState === "A" || editingHotel.hotState === true,
      });
      setSelectedCatIds(editingHotel.categories?.map((c) => c.catSec) ?? []);
      setExistingImages(editingHotel.hotelImagesUrl ?? []);
      setRemovedExistingImages([]);
      setImageFiles([]);
      setPreviews([]);
    } else {

      setForm(INITIAL);
      setSelectedCatIds([]);
      setExistingImages([]);
      setRemovedExistingImages([]);
      setImageFiles([]);
      setPreviews([]);
    }

  }, [editingHotel]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleCat = (catSec) => {
    setSelectedCatIds((prev) =>
      prev.includes(catSec) ? prev.filter((id) => id !== catSec) : [...prev, catSec]
    );
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles((p) => [...p, ...files]);
    setPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeImage = (i) => {
    setImageFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const removeExistingImage = (hotImgSec) => {
    setExistingImages((p) => p.filter((img) => img.hotImgSec !== hotImgSec));
    setRemovedExistingImages((p) => [...p, hotImgSec]);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setSaving(true);

    try {

      const payload = {
        ...form,
        hotState: form.hotState ? "A" : "I",
        hotCitSec: Number(form.city),
        categoryIds: selectedCatIds,
      };

      if (editingHotel) {

        await updateHotel(editingHotel.hotSec, payload);

        for (let i = 0; i < imageFiles.length; i++) {
          await uploadHotelImage(editingHotel.hotSec, i + 1, imageFiles[i]);
        }
      } else {

        const created = await createHotel(payload);

        for (let i = 0; i < imageFiles.length; i++) {
          await uploadHotelImage(created.hotSec, i + 1, imageFiles[i]);
        }
      }

      onSuccess();
      onClose();

    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-panel">
        <div className="drawer-header">
          <h2 className="drawer-title">
            {editingHotel ? "Editar hotel" : "Registrar hotel"}
          </h2>
          <button className="drawer-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <div className="drawer-body">

            {/* Información general */}
            <div className="form-section">
              <p className="form-section-label">Información general</p>

              <div className={styles.field}>
                <label className={styles.label}>Nombre del hotel</label>
                <input
                  className={styles.input}
                  type="text"
                  name="hotName"
                  placeholder="Ej. Grand Palace Bogotá"
                  value={form.hotName}
                  onChange={handle}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className={styles.textarea}
                  name="hotDescription"
                  placeholder="Describe las características del hotel..."
                  value={form.hotDescription}
                  onChange={handle}
                  required
                  rows={3}
                />
              </div>
            </div>

            {/* Ubicación y precio */}
            <div className="form-section">
              <p className="form-section-label">Ubicación y precio</p>

              <div className={styles.field}>
                <label className={styles.label}>Dirección</label>
                <input
                  className={styles.input}
                  type="text"
                  name="hotAddress"
                  placeholder="Calle 123 #45-67"
                  value={form.hotAddress}
                  onChange={handle}
                  required
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Ciudad</label>
                  <select
                    className={styles.select}
                    name="city"
                    value={form.city}
                    onChange={handle}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {cities.map((c) => (
                      <option key={c.citSec} value={c.citSec}>{c.citName}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Costo por noche (COP)</label>
                  <input
                    className={styles.input}
                    type="number"
                    name="hotCost"
                    placeholder="0"
                    value={form.hotCost}
                    onChange={handle}
                    required
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="form-section">
              <p className="form-section-label">Estado</p>
              <div className={styles.toggleRow}>
                <div>
                  <p className={styles.toggleTitle}>Hotel activo</p>
                  <p className={styles.toggleDesc}>
                    {form.hotState
                      ? "El hotel está disponible para reservas"
                      : "El hotel no aparecerá en la plataforma"}
                  </p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    name="hotState"
                    checked={form.hotState}
                    onChange={handle}
                  />
                  <span className={styles.toggleTrack}>
                    <span className={styles.toggleThumb} />
                  </span>
                </label>
              </div>
            </div>

            {/* Categorías */}
            <div className="form-section">
              <p className="form-section-label">Categorías</p>
              {categories.length === 0 ? (
                <p className={styles.loadingText}>Cargando categorías...</p>
              ) : (
                <div className={styles.catGrid}>
                  {categories.map((cat) => {
                    const active = selectedCatIds.includes(cat.catSec);
                    return (
                      <button
                        key={cat.catSec}
                        type="button"
                        className={`${styles.catChip} ${active ? styles.catChipActive : ""}`}
                        onClick={() => toggleCat(cat.catSec)}
                      >
                        {active && <span className={styles.catCheck}>✓</span>}
                        {cat.catName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Imágenes */}
            <div className="form-section">
              <p className="form-section-label">Imágenes</p>

              <label className={styles.uploadZone}>
                <Upload size={20} className={styles.uploadIcon} />
                <p className={styles.uploadTitle}>Selecciona o arrastra imágenes</p>
                <p className={styles.uploadHint}>PNG, JPG, WEBP — múltiples permitidas</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  className={styles.fileInput}
                />
              </label>

              {(existingImages.length > 0 || previews.length > 0) && (
                <div className={styles.previews}>
                  {/* Imágenes ya guardadas en el servidor */}
                  {existingImages.map((img, i) => (
                    <div key={`existing-${img.hotImgSec}`} className={styles.previewItem}>
                      <img src={`${BASE_URL}${img.hotImgUrl}`} alt="" />
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeExistingImage(img.hotImgSec)}
                      >
                        <X size={11} />
                      </button>
                      <span className={styles.priority}>#{i + 1}</span>
                    </div>
                  ))}

                  {/* Imágenes nuevas seleccionadas ahora */}
                  {previews.map((src, i) => (
                    <div key={`new-${i}`} className={styles.previewItem}>
                      <img src={src} alt="" />
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeImage(i)}
                      >
                        <X size={11} />
                      </button>
                      <span className={styles.priority}>#{existingImages.length + i + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="drawer-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  Guardando...
                </span>
              ) : editingHotel ? (
                "Actualizar hotel"
              ) : (
                "Registrar hotel"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
