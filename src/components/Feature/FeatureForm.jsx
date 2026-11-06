import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";
import { FormDrawer } from "../ui/FormDrawer/FormDrawer";
import { Field, Switch } from "../ui/Form/Form";

// La API usa feaSec/feaName/feaEst/feaIconUrl; id/name/state quedan por compatibilidad
const idOf = (f) => f?.feaSec ?? f?.id ?? null;

/** Crear/editar característica. onSubmit(payload) guarda y lanza si falla. */
export const FeatureForm = ({ initial = null, onClose, onSubmit }) => {
  const { hasActionPermission } = useAuth();
  const isEditing = Boolean(idOf(initial));

  const [form, setForm] = useState(() => ({
    name: initial?.feaName ?? initial?.name ?? "",
    // El backend lee y devuelve feaEst (antes se leía feaState, que no existe)
    state: initial?.feaEst ?? initial?.feaState ?? initial?.state ?? "A",
  }));
  const [errors, setErrors] = useState({});

  const set = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const can = (action) =>
    hasActionPermission(MODULES.FEATURES, action) || hasActionPermission("Features", action);
  const canSave = isEditing ? can(ACTIONS.UPDATE) : can(ACTIONS.CREATE);

  const submit = async () => {
    const name = form.name.trim();
    if (!name) {
      setErrors({ name: "Escribe el nombre de la característica." });
      return false;
    }

    const id = idOf(initial);
    await onSubmit({
      ...(isEditing ? { id, feaSec: id } : {}),
      name,
      feaName: name,
      // feaEst es el campo que guarda el backend; state/feaState quedan por compatibilidad
      feaEst: form.state,
      state: form.state,
      feaState: form.state,
      // Conserva el ícono existente (el form no lo edita)
      feaIconUrl: initial?.feaIconUrl ?? null,
    });
  };

  return (
    <FormDrawer
      title={isEditing ? `Editar «${initial.feaName ?? initial.name}»` : "Nueva característica"}
      description="Servicios y comodidades que se marcan en cada alojamiento."
      submitLabel={isEditing ? "Guardar cambios" : "Crear característica"}
      canSubmit={canSave}
      onClose={onClose}
      onSubmit={submit}
    >
      <Field label="Nombre" required error={errors.name}>
        {(p) => (
          <input {...p} className="sn-input" value={form.name} maxLength={60}
            placeholder="Ej. Piscina, Wi-Fi, Parqueadero" onChange={(e) => set("name", e.target.value)} />
        )}
      </Field>

      <Switch
        label="Activa"
        description={form.state === "A" ? "Se puede marcar en los hoteles." : "No aparece al editar hoteles."}
        checked={form.state === "A"}
        onChange={(on) => set("state", on ? "A" : "I")}
      />
    </FormDrawer>
  );
};
