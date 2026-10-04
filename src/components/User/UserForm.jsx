import { useEffect, useState } from "react";
import { createUser, updateUser, getProfiles } from "../../services/userServices/userService";
import styles from "./UserForm.module.css";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  profileId: "",
};

export default function UserForm({ editingUser, setEditingUser, onSuccess, onClose }) {

  const [form, setForm] = useState(EMPTY_FORM);
  const [profiles, setProfiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  const isEditing = !!editingUser;

  useEffect(() => {
    getProfiles().then(setProfiles).catch(() => setProfiles([]));
  }, []);

  useEffect(() => {
    if (editingUser) {
      setForm({
        firstName: editingUser.firstName ?? "",
        lastName: editingUser.lastName ?? "",
        email: editingUser.email ?? "",
        password: "",
        profileId: editingUser.profile?.proId ?? "",
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Requerido";
    if (!form.lastName.trim()) newErrors.lastName = "Requerido";
    if (!form.email.trim()) newErrors.email = "Requerido";
    if (!isEditing && !form.password.trim()) newErrors.password = "Requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateUser(editingUser.userSec, {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          profileId: form.profileId || null,
        });
      } else {
        await createUser({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          profileId: form.profileId || null,
        });
      }
      onSuccess();
      handleClose();
    } catch (err) {
      setApiError(err?.response?.data?.message ?? "No se pudo guardar el usuario.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setEditingUser(null);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h3 className={styles.title}>{isEditing ? "Editar usuario" : "Nuevo usuario"}</h3>
          <button type="button" className={styles.closeBtn} onClick={handleClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {apiError && <p className={styles.apiError}>{apiError}</p>}

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre *</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
              />
              {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Apellido *</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
              />
              {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          {!isEditing && (
            <div className={styles.field}>
              <label className={styles.label}>Contraseña *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Perfil</label>
            <select
              name="profileId"
              value={form.profileId}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">Por defecto (Usuario)</option>
              {profiles.map((p) => (
                <option key={p.proId} value={p.proId}>{p.proName}</option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}