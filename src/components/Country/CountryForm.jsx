import { useState } from "react";
import { FormDrawer } from "../ui/FormDrawer/FormDrawer";
import { Field, Switch } from "../ui/Form/Form";

/**
 * Crear/editar país en el panel lateral. El padre lo monta con key por registro:
 *   {showForm && <CountryForm key={editing?.paiSec ?? "new"} initial={editing} onClose onSubmit />}
 * onSubmit(payload) guarda y lanza si falla (el drawer muestra el error).
 */
export const CountryForm = ({ initial, onClose, onSubmit }) => {
  const [form, setForm] = useState(() => ({
    paiName: initial?.paiName ?? "",
    paiState: initial?.paiState ?? "A",
    paiSec: initial?.paiSec ?? null,
  }));
  const [errors, setErrors] = useState({});

  const set = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const submit = async () => {
    const paiName = form.paiName.trim();
    if (!paiName) {
      setErrors({ paiName: "Escribe el nombre del país." });
      return false;
    }
    await onSubmit({ ...form, paiName });
  };

  return (
    <FormDrawer
      title={initial ? `Editar «${initial.paiName}»` : "Nuevo país"}
      description="Los países agrupan departamentos y ciudades."
      submitLabel={initial ? "Guardar cambios" : "Crear país"}
      onClose={onClose}
      onSubmit={submit}
    >
      <Field label="Nombre" required error={errors.paiName}>
        {(p) => (
          <input {...p} className="sn-input" value={form.paiName} maxLength={60}
            placeholder="Ej. Colombia" onChange={(e) => set("paiName", e.target.value)} />
        )}
      </Field>

      <Switch
        label="Activo"
        description={form.paiState === "A" ? "Disponible para crear departamentos." : "No aparece en los formularios."}
        checked={form.paiState === "A"}
        onChange={(on) => set("paiState", on ? "A" : "I")}
      />
    </FormDrawer>
  );
};
