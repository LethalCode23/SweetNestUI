import { useState } from "react";
import { FormDrawer } from "../ui/FormDrawer/FormDrawer";
import { Field, Switch } from "../ui/Form/Form";

const MAX_NAME = 50;
const SELF_LOCK = "No puedes quitarte este permiso a ti mismo.";

/**
 * Crear/editar perfil. onSubmit(payload) guarda y lanza si falla (FormDrawer muestra el error).
 * - isOwnProfile: es el perfil del usuario logueado → no puede inactivarlo ni quitarle el control de accesos.
 * - Siempre hay un perfil por defecto: el actual no se puede desmarcar, se cambia marcando otro.
 */
export const ProfileForm = ({ initial, isOwnProfile = false, onClose, onSubmit }) => {
    const [form, setForm] = useState(() => ({
        proName: initial?.proName ?? "",
        proState: initial?.proState ?? "A",
        isDefault: initial?.isDefault ?? "N",
        hasControlAccess: initial?.hasControlAccess ?? "N",
    }));
    const [errors, setErrors] = useState({});

    const isCurrentDefault = initial?.isDefault === "S";

    const set = (name, value) => {
        setForm((s) => ({ ...s, [name]: value }));
        setErrors((e) => ({ ...e, [name]: null }));
    };

    const submit = async () => {
        const proName = form.proName.trim();
        if (!proName) {
            setErrors({ proName: "Escribe el nombre del perfil." });
            return false;
        }
        await onSubmit({ ...form, proName });
    };

    return (
        <FormDrawer
            title={initial ? `Editar «${initial.proName}»` : "Nuevo perfil"}
            description="El perfil define a qué secciones del panel entra cada usuario. Los accesos se configuran después, desde «Accesos»."
            submitLabel={initial ? "Guardar cambios" : "Crear perfil"}
            onClose={onClose}
            onSubmit={submit}
        >
            <Field label="Nombre" required error={errors.proName} hint={`Máximo ${MAX_NAME} caracteres.`}>
                {(p) => (
                    <input {...p} className="sn-input" value={form.proName} maxLength={MAX_NAME}
                        placeholder="Ej. Recepción" onChange={(e) => set("proName", e.target.value)} />
                )}
            </Field>

            <Switch
                label="Activo"
                description={isOwnProfile
                    ? SELF_LOCK
                    : form.proState === "A" ? "Sus usuarios pueden entrar al panel." : "Sus usuarios no pueden entrar."}
                checked={form.proState === "A"}
                disabled={isOwnProfile}
                onChange={(on) => set("proState", on ? "A" : "I")}
            />

            <Switch
                label="Puede administrar accesos"
                description={isOwnProfile
                    ? SELF_LOCK
                    : "Sus usuarios pueden crear perfiles y cambiar los accesos de otros."}
                checked={form.hasControlAccess === "S"}
                disabled={isOwnProfile}
                onChange={(on) => set("hasControlAccess", on ? "S" : "N")}
            />

            <Switch
                label="Perfil por defecto"
                description={isCurrentDefault
                    ? "Es el perfil de las cuentas nuevas. Para cambiarlo, marca otro perfil como predeterminado."
                    : "Las cuentas nuevas reciben este perfil. El predeterminado actual deja de serlo."}
                checked={form.isDefault === "S"}
                disabled={isCurrentDefault}
                onChange={(on) => set("isDefault", on ? "S" : "N")}
            />
        </FormDrawer>
    );
};

export default ProfileForm;
