import { useState } from "react";
import { FormDrawer } from "../ui/FormDrawer/FormDrawer";
import { Field, SegmentedControl, Switch } from "../ui/Form/Form";

const UNIT_OPTIONS = [
    { value: "N", label: "Unidad única" },
    { value: "S", label: "Varias unidades" },
];

const MAX_NAME = 50;

/** Crear/editar tipo de alojamiento. onSubmit(payload) guarda y lanza si falla. */
export const HotelTypeForm = ({ initial, onClose, onSubmit }) => {
    const [form, setForm] = useState(() => ({
        typName: initial?.typName ?? "",
        typMultiUnit: initial?.typMultiUnit ?? "N",
        typState: initial?.typState ?? "A",
        typSec: initial?.typSec ?? null,
    }));
    const [errors, setErrors] = useState({});

    const set = (name, value) => {
        setForm((s) => ({ ...s, [name]: value }));
        setErrors((e) => ({ ...e, [name]: null }));
    };

    const submit = async () => {
        const typName = form.typName.trim();
        if (!typName) {
            setErrors({ typName: "Escribe el nombre del tipo." });
            return false;
        }
        await onSubmit({ ...form, typName });
    };

    return (
        <FormDrawer
            title={initial ? `Editar «${initial.typName}»` : "Nuevo tipo de alojamiento"}
            description="El tipo define si el alojamiento se reserva completo o por unidades."
            submitLabel={initial ? "Guardar cambios" : "Crear tipo"}
            onClose={onClose}
            onSubmit={submit}
        >
            <Field label="Nombre" required error={errors.typName} hint={`Máximo ${MAX_NAME} caracteres.`}>
                {(p) => (
                    <input {...p} className="sn-input" value={form.typName} maxLength={MAX_NAME}
                        placeholder="Ej. Cabaña" onChange={(e) => set("typName", e.target.value)} />
                )}
            </Field>

            <SegmentedControl
                label="Unidades"
                value={form.typMultiUnit}
                onChange={(v) => set("typMultiUnit", v)}
                options={UNIT_OPTIONS}
                hint={form.typMultiUnit === "S"
                    ? "Permite cargar habitaciones, cada una con su precio y capacidad (ej. hotel)."
                    : "Se reserva el alojamiento completo (ej. casa o apartamento)."}
            />

            <Switch
                label="Activo"
                description={form.typState === "A" ? "Disponible al crear hoteles." : "No aparece al crear hoteles."}
                checked={form.typState === "A"}
                onChange={(on) => set("typState", on ? "A" : "I")}
            />
        </FormDrawer>
    );
};
