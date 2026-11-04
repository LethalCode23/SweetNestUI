import { useState } from "react";
import { FormDrawer } from "../ui/FormDrawer/FormDrawer";
import { Field, Switch } from "../ui/Form/Form";

/** Crear/editar categoría. onSubmit(payload) guarda y lanza si falla. */
export const CategoryForm = ({ initial, onClose, onSubmit }) => {
  const [form, setForm] = useState(() => ({
    catName: initial?.catName ?? "",
    catEst: initial?.catEst ?? "A",
    catSec: initial?.catSec ?? null,
  }));
  const [errors, setErrors] = useState({});

  const set = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const submit = async () => {
    const catName = form.catName.trim();
    if (!catName) {
      setErrors({ catName: "Escribe el nombre de la categoría." });
      return false;
    }
    await onSubmit({ ...form, catName });
  };

  return (
    <FormDrawer
      title={initial ? `Editar «${initial.catName}»` : "Nueva categoría"}
      description="Las categorías agrupan los alojamientos en la búsqueda."
      submitLabel={initial ? "Guardar cambios" : "Crear categoría"}
      onClose={onClose}
      onSubmit={submit}
    >
      <Field label="Nombre" required error={errors.catName}>
        {(p) => (
          <input {...p} className="sn-input" value={form.catName} maxLength={60}
            placeholder="Ej. Playa" onChange={(e) => set("catName", e.target.value)} />
        )}
      </Field>

      <Switch
        label="Activa"
        description={form.catEst === "A" ? "Se puede asignar a los hoteles." : "No aparece al editar hoteles."}
        checked={form.catEst === "A"}
        onChange={(on) => set("catEst", on ? "A" : "I")}
      />
    </FormDrawer>
  );
};
