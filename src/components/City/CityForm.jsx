import { useEffect, useState } from "react";
import { createCity, updateCity } from "../../services/cityServices/cityService";
import { getAll } from "../../services/departmentServices/departmentService";
import { useAuth } from "../../context/AuthContext";
import { MODULES, ACTIONS } from "../../constants/modules";
import { unwrapList } from "../../Utils/apiError";
import { FormDrawer } from "../ui/FormDrawer/FormDrawer";
import { Field, Switch } from "../ui/Form/Form";

/**
 * Crear/editar ciudad. Guarda por su cuenta (PUT/POST) y avisa con onSuccess (recargar la lista).
 * Si el guardado falla, el drawer muestra el error (antes era una promesa rechazada sin aviso).
 */
const CityForm = ({ editingCity, onSuccess, onClose }) => {

  const { hasActionPermission } = useAuth();
  const isEditing = Boolean(editingCity);

  const [form, setForm] = useState(() => ({
    citName: editingCity?.citName || "",
    department: editingCity?.department?.depSec ?? editingCity?.citDepSec ?? "",
    citState: editingCity?.citState === "A" || editingCity?.citState === true || !editingCity ? "A" : "I",
  }));
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState(null);

  useEffect(() => {
    let active = true;
    getAll()
      .then((res) => { if (active) setDepartments(unwrapList(res)); })
      .catch(() => { if (active) setDepartments([]); });
    return () => { active = false; };
  }, []);

  const set = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const submit = async () => {
    const citName = form.citName.trim();
    const next = {};
    if (!citName) next.citName = "Escribe el nombre de la ciudad.";
    if (!form.department) next.department = "Elige el departamento al que pertenece.";
    if (Object.keys(next).length) {
      setErrors(next);
      return false;
    }

    const payload = {
      citName,
      citState: form.citState,
      citDepSec: form.department,
    };

    if (isEditing) {
      await updateCity(editingCity.citSec, payload);
    } else {
      await createCity(payload);
    }
    await onSuccess();
  };

  const canSave = isEditing
    ? hasActionPermission(MODULES.CITIES, ACTIONS.UPDATE)
    : hasActionPermission(MODULES.CITIES, ACTIONS.CREATE);

  return (
    <FormDrawer
      title={isEditing ? `Editar «${editingCity.citName}»` : "Nueva ciudad"}
      description="Las ciudades se asignan a los hoteles y aparecen en la búsqueda."
      submitLabel={isEditing ? "Guardar cambios" : "Crear ciudad"}
      canSubmit={canSave}
      onClose={onClose}
      onSubmit={submit}
    >
      <Field label="Nombre" required error={errors.citName}>
        {(p) => (
          <input {...p} className="sn-input" value={form.citName} maxLength={60}
            placeholder="Ej. Medellín" onChange={(e) => set("citName", e.target.value)} />
        )}
      </Field>

      <Field label="Departamento" required error={errors.department}>
        {(p) => (
          <select {...p} className="sn-select sn-select--block" value={form.department}
            onChange={(e) => set("department", e.target.value)} disabled={departments === null}>
            <option value="">{departments === null ? "Cargando departamentos…" : "Elige un departamento"}</option>
            {(departments ?? []).map((dep) => (
              <option key={dep.depSec} value={dep.depSec}>
                {dep.depName}{dep.countryResponseDto?.paiName ? ` · ${dep.countryResponseDto.paiName}` : ""}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Switch
        label="Activa"
        description={form.citState === "A" ? "Se puede asignar a los hoteles." : "No aparece al crear hoteles."}
        checked={form.citState === "A"}
        onChange={(on) => set("citState", on ? "A" : "I")}
      />
    </FormDrawer>
  );
};

export default CityForm;
