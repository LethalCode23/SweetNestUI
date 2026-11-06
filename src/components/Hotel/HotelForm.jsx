import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { updateHotel, createHotel, uploadHotelImage } from "../../services/hotelServices/hotelService";
import { getActives as getActiveTypes } from "../../services/hotelServices/typeHotelService";
import { getCities } from "../../services/cityServices/cityService";
import { getAll as getCategories } from "../../services/categoryServices/categoryService";
import { getAllFeatures } from "../../services/featureServices/featureService";
import { BASE_URL } from "../../Js/constants";
import { unwrapList } from "../../Utils/apiError";
import { FormDrawer } from "../ui/FormDrawer/FormDrawer";
import { ChipGroup, Field, FieldRow, FormSection, Switch } from "../ui/Form/Form";
import styles from "./HotelForm.module.css";

const fromEditing = (h) => ({
  hotName: h?.hotName ?? "",
  hotDescription: h?.hotDescription ?? "",
  hotAddress: h?.hotAddress ?? "",
  hotCost: h?.hotCost ?? "",
  city: h?.city?.citSec ?? h?.hotCitSec ?? "",
  typeId: h?.typeId ?? "",
  hotState: h ? h.hotState === "A" || h.hotState === true : true,
});

/**
 * Crear/editar hotel en el panel lateral. Guarda por su cuenta (hotel + imágenes) y avisa con onSuccess.
 * El backend exige typeId al crear (404/1008): antes el form no lo enviaba y crear siempre fallaba.
 */
export default function HotelForm({ editingHotel, onSuccess, onClose }) {

  const isEditing = Boolean(editingHotel);
  const [form, setForm] = useState(() => fromEditing(editingHotel));
  const [errors, setErrors] = useState({});
  const [selectedCatIds, setSelectedCatIds] = useState(() => editingHotel?.categories?.map((c) => c.catSec) ?? []);
  const [selectedFeaIds, setSelectedFeaIds] = useState(() => editingHotel?.features?.map((f) => f.feaSec) ?? []);
  const [existingImages, setExistingImages] = useState(() => editingHotel?.hotelImagesUrl ?? []);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    getCities().then((r) => setCities(unwrapList(r))).catch(() => setCities([]));
    getActiveTypes().then((r) => setTypes(unwrapList(r))).catch(() => setTypes([]));
    getCategories().then((r) => setCategories(unwrapList(r))).catch(() => setCategories([]));
    getAllFeatures().then((r) => setFeatures(unwrapList(r))).catch(() => setFeatures([]));
  }, []);

  const set = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const toggle = (setter) => (id) =>
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleImages = (e) => {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setImageFiles((p) => [...p, ...files]);
    setPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeImage = (i) => {
    URL.revokeObjectURL(previews[i]);
    setImageFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  // Nota: quitar una imagen ya guardada solo la oculta acá; el backend todavía no expone el borrado
  const removeExistingImage = (hotImgSec) => {
    setExistingImages((p) => p.filter((img) => img.hotImgSec !== hotImgSec));
  };

  const validate = () => {
    const next = {};
    if (!form.hotName.trim()) next.hotName = "Escribe el nombre del hotel.";
    if (!form.hotDescription.trim()) next.hotDescription = "Escribe una descripción.";
    if (!form.hotAddress.trim()) next.hotAddress = "Escribe la dirección.";
    if (!form.city) next.city = "Elige la ciudad.";
    if (!form.typeId) next.typeId = "Elige el tipo de alojamiento.";
    if (form.hotCost === "" || Number(form.hotCost) < 0) next.hotCost = "Escribe un costo válido.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return false;

    const payload = {
      ...form,
      hotName: form.hotName.trim(),
      hotDescription: form.hotDescription.trim(),
      hotAddress: form.hotAddress.trim(),
      hotCost: Number(form.hotCost),
      hotState: form.hotState ? "A" : "I",
      hotCitSec: Number(form.city),
      typeId: Number(form.typeId),
      categoryIds: selectedCatIds,
      featureIds: selectedFeaIds,
      // Se conservan los datos que este form no edita (null en hostId = no cambia)
      hotConfirmReq: editingHotel?.hotConfirmReq,
      hostId: editingHotel?.hostId ?? null,
    };

    let hotSec;
    if (isEditing) {
      await updateHotel(editingHotel.hotSec, payload);
      hotSec = editingHotel.hotSec;
    } else {
      // TEMPORAL (bug del backend): POST /hotel/save responde 500 si trae featureIds, porque
      // HotelService.save() arma las Feature como entidades nuevas (featureMapper::toEntity).
      // El update sí funciona. Se crea sin características y se aplican con un update.
      // Quitar cuando el backend use featureRepository.findAllById en save().
      const created = await createHotel({ ...payload, featureIds: [] });
      hotSec = created.hotSec;
      if (selectedFeaIds.length) {
        await updateHotel(hotSec, { ...payload, hotConfirmReq: created.hotConfirmReq });
      }
    }

    for (let i = 0; i < imageFiles.length; i++) {
      await uploadHotelImage(hotSec, i + 1, imageFiles[i]);
    }

    previews.forEach((src) => URL.revokeObjectURL(src));
    await onSuccess();
  };

  const toOptions = (list, value, label) => list.map((x) => ({ value: x[value], label: x[label] }));

  return (
    <FormDrawer
      size="md"
      title={isEditing ? `Editar «${editingHotel.hotName}»` : "Nuevo hotel"}
      description="Los cambios se ven en la búsqueda pública apenas los guardas."
      submitLabel={isEditing ? "Guardar cambios" : "Crear hotel"}
      onClose={onClose}
      onSubmit={submit}
    >
      <FormSection title="Información general">
        <Field label="Nombre" required error={errors.hotName}>
          {(p) => (
            <input {...p} className="sn-input" value={form.hotName} placeholder="Ej. Hotel Poblado Suite"
              onChange={(e) => set("hotName", e.target.value)} />
          )}
        </Field>
        <Field label="Descripción" required error={errors.hotDescription}>
          {(p) => (
            <textarea {...p} className="sn-textarea" rows={3} value={form.hotDescription}
              placeholder="Qué lo hace especial, a quién está dirigido…"
              onChange={(e) => set("hotDescription", e.target.value)} />
          )}
        </Field>
        <Field label="Tipo de alojamiento" required error={errors.typeId}
          hint="Define si se reserva completo o por unidades.">
          {(p) => (
            <select {...p} className="sn-select sn-select--block" value={form.typeId}
              onChange={(e) => set("typeId", e.target.value)}>
              <option value="">Elige un tipo</option>
              {types.map((t) => (
                <option key={t.typSec} value={t.typSec}>{t.typName}</option>
              ))}
            </select>
          )}
        </Field>
      </FormSection>

      <FormSection title="Ubicación y precio">
        <Field label="Dirección" required error={errors.hotAddress}>
          {(p) => (
            <input {...p} className="sn-input" value={form.hotAddress} placeholder="Cra 43A #9-12"
              onChange={(e) => set("hotAddress", e.target.value)} />
          )}
        </Field>
        <FieldRow>
          <Field label="Ciudad" required error={errors.city}>
            {(p) => (
              <select {...p} className="sn-select sn-select--block" value={form.city}
                onChange={(e) => set("city", e.target.value)}>
                <option value="">Elige una ciudad</option>
                {cities.map((c) => (
                  <option key={c.citSec} value={c.citSec}>{c.citName}</option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Costo por noche (COP)" required error={errors.hotCost}>
            {(p) => (
              <input {...p} type="number" inputMode="numeric" min={0} step={1000} className="sn-input"
                value={form.hotCost} placeholder="0" onChange={(e) => set("hotCost", e.target.value)} />
            )}
          </Field>
        </FieldRow>
      </FormSection>

      <FormSection title="Publicación">
        <Switch
          label="Hotel activo"
          description={form.hotState ? "Aparece en la búsqueda y se puede reservar." : "Queda oculto en la plataforma."}
          checked={form.hotState}
          onChange={(on) => set("hotState", on)}
        />
      </FormSection>

      <FormSection title="Categorías y características">
        <ChipGroup
          label="Categorías"
          options={toOptions(categories, "catSec", "catName")}
          selected={selectedCatIds}
          onToggle={toggle(setSelectedCatIds)}
          emptyText="Todavía no hay categorías creadas."
        />
        <ChipGroup
          label="Características"
          options={toOptions(features, "feaSec", "feaName")}
          selected={selectedFeaIds}
          onToggle={toggle(setSelectedFeaIds)}
          emptyText="Todavía no hay características creadas."
        />
      </FormSection>

      <FormSection title="Imágenes" description="La primera es la que se muestra en las tarjetas.">
        <label className={styles.dropzone}>
          <ImagePlus size={22} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.dropTitle}>Arrastra imágenes o haz clic para elegirlas</span>
          <span className={styles.dropHint}>PNG, JPG o WEBP. Puedes subir varias.</span>
          <input type="file" accept="image/*" multiple onChange={handleImages} className={styles.fileInput} />
        </label>

        {(existingImages.length > 0 || previews.length > 0) && (
          <ul className={styles.previews}>
            {existingImages.map((img, i) => (
              <li key={`existing-${img.hotImgSec}`} className={styles.preview}>
                <img src={`${BASE_URL}${img.hotImgUrl}`} alt="" />
                <span className={styles.order}>{i + 1}</span>
                <button type="button" className={styles.remove} onClick={() => removeExistingImage(img.hotImgSec)}
                  aria-label={`Quitar imagen ${i + 1}`}>
                  <X size={12} aria-hidden="true" />
                </button>
              </li>
            ))}
            {previews.map((src, i) => (
              <li key={src} className={`${styles.preview} ${styles.isNew}`}>
                <img src={src} alt="" />
                <span className={styles.order}>{existingImages.length + i + 1}</span>
                <button type="button" className={styles.remove} onClick={() => removeImage(i)}
                  aria-label={`Quitar imagen nueva ${i + 1}`}>
                  <X size={12} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </FormSection>
    </FormDrawer>
  );
}
