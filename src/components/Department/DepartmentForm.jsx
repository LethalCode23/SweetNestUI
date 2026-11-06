import { useState, useEffect } from "react";
import { getAll as getCountries } from "../../services/countryServices/countryService";
import { unwrapList } from "../../Utils/apiError";
import { FormDrawer } from "../ui/FormDrawer/FormDrawer";
import { Field, Switch } from "../ui/Form/Form";

/** Crear/editar departamento. onSubmit(payload) guarda y lanza si falla. */
export const DepartmentForm = ({ initial, onClose, onSubmit }) => {
  const [form, setForm] = useState(() => ({
    depName: initial?.depName ?? "",
    depState: initial?.depState ?? "A",
    depSec: initial?.depSec ?? null,
    depPaiSec: initial?.countryResponseDto?.paiSec ?? initial?.pais?.paiSec ?? initial?.depPaiSec ?? "",
  }));
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    let active = true;
    getCountries()
      .then((res) => { if (active) setCountries(unwrapList(res)); })
      .catch(() => { if (active) setCountries([]); });
    return () => { active = false; };
  }, []);

  const set = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const submit = async () => {
    const depName = form.depName.trim();
    const next = {};
    if (!depName) next.depName = "Escribe el nombre del departamento.";
    // Antes un país sin elegir se enviaba como Number(null) = 0
    if (!form.depPaiSec) next.depPaiSec = "Elige el país al que pertenece.";
    if (Object.keys(next).length) {
      setErrors(next);
      return false;
    }

    await onSubmit({
      depSec: form.depSec,
      depName,
      depState: form.depState,
      countryResponseDto: { paiSec: Number(form.depPaiSec), paiName: "" },
    });
  };

  return (
    <FormDrawer
      title={initial ? `Editar «${initial.depName}»` : "Nuevo departamento"}
      description="Cada departamento pertenece a un país y agrupa sus ciudades."
      submitLabel={initial ? "Guardar cambios" : "Crear departamento"}
      onClose={onClose}
      onSubmit={submit}
    >
      <Field label="Nombre" required error={errors.depName}>
        {(p) => (
          <input {...p} className="sn-input" value={form.depName} maxLength={60}
            placeholder="Ej. Antioquia" onChange={(e) => set("depName", e.target.value)} />
        )}
      </Field>

      <Field label="País" required error={errors.depPaiSec}>
        {(p) => (
          <select {...p} className="sn-select sn-select--block" value={form.depPaiSec}
            onChange={(e) => set("depPaiSec", e.target.value)} disabled={countries === null}>
            <option value="">{countries === null ? "Cargando países…" : "Elige un país"}</option>
            {(countries ?? []).map((c) => (
              <option key={c.paiSec} value={c.paiSec}>{c.paiName}</option>
            ))}
          </select>
        )}
      </Field>

      <Switch
        label="Activo"
        description={form.depState === "A" ? "Disponible para crear ciudades." : "No aparece en los formularios."}
        checked={form.depState === "A"}
        onChange={(on) => set("depState", on ? "A" : "I")}
      />
    </FormDrawer>
  );
};
