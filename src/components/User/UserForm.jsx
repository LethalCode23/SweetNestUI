import { useEffect, useState } from "react";
import { createUser, updateUser, getProfiles } from "../../services/userServices/userService";
import { unwrapList } from "../../Utils/apiError";
import { FormDrawer } from "../ui/FormDrawer/FormDrawer";
import { Field, FieldRow } from "../ui/Form/Form";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Crear/editar usuario en el panel lateral (antes era un modal propio).
 * Guarda por su cuenta y avisa con onSuccess; los errores del backend van al banner del drawer.
 */
export default function UserForm({ editingUser, onSuccess, onClose }) {

  const isEditing = Boolean(editingUser);
  const [form, setForm] = useState(() => ({
    firstName: editingUser?.firstName ?? "",
    lastName: editingUser?.lastName ?? "",
    email: editingUser?.email ?? "",
    password: "",
    profileId: editingUser?.profile?.proId ?? "",
  }));
  const [errors, setErrors] = useState({});
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    getProfiles().then((res) => setProfiles(unwrapList(res))).catch(() => setProfiles([]));
  }, []);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Escribe el nombre.";
    if (!form.lastName.trim()) next.lastName = "Escribe el apellido.";
    if (!form.email.trim()) next.email = "Escribe el email.";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "El email no tiene un formato válido.";
    if (!isEditing && !form.password.trim()) next.password = "Escribe una contraseña.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return false;

    const base = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      profileId: form.profileId || null,
    };

    if (isEditing) {
      await updateUser(editingUser.userSec, base);
    } else {
      await createUser({ ...base, password: form.password });
    }
    await onSuccess();
  };

  const fullName = [editingUser?.firstName, editingUser?.lastName].filter(Boolean).join(" ");

  return (
    <FormDrawer
      title={isEditing ? `Editar a ${fullName || "usuario"}` : "Nuevo usuario"}
      description={isEditing
        ? "La contraseña no se cambia desde acá."
        : "La persona podrá entrar con este email y contraseña."}
      submitLabel={isEditing ? "Guardar cambios" : "Crear usuario"}
      onClose={onClose}
      onSubmit={submit}
    >
      <FieldRow>
        <Field label="Nombre" required error={errors.firstName}>
          {(p) => (
            <input {...p} className="sn-input" value={form.firstName} autoComplete="given-name"
              onChange={(e) => set("firstName", e.target.value)} />
          )}
        </Field>
        <Field label="Apellido" required error={errors.lastName}>
          {(p) => (
            <input {...p} className="sn-input" value={form.lastName} autoComplete="family-name"
              onChange={(e) => set("lastName", e.target.value)} />
          )}
        </Field>
      </FieldRow>

      <Field label="Email" required error={errors.email}>
        {(p) => (
          <input {...p} type="email" className="sn-input" value={form.email} autoComplete="email"
            placeholder="nombre@correo.com" onChange={(e) => set("email", e.target.value)} />
        )}
      </Field>

      {!isEditing && (
        <Field label="Contraseña" required error={errors.password}>
          {(p) => (
            <input {...p} type="password" className="sn-input" value={form.password} autoComplete="new-password"
              onChange={(e) => set("password", e.target.value)} />
          )}
        </Field>
      )}

      <Field label="Perfil" hint="Define a qué secciones del panel puede entrar.">
        {(p) => (
          <select {...p} className="sn-select sn-select--block" value={form.profileId}
            onChange={(e) => set("profileId", e.target.value)}>
            <option value="">Por defecto (Usuario)</option>
            {profiles.map((pr) => (
              <option key={pr.proId} value={pr.proId}>{pr.proName}</option>
            ))}
          </select>
        )}
      </Field>
    </FormDrawer>
  );
}
