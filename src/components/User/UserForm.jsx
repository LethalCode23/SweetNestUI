import { useEffect, useState } from "react";
import { createUser, updateUser, getProfiles } from "../../services/userServices/userService";
import styles from "./UserForm.module.css";
import { MODULES, ACTIONS } from "../../constants/modules";
import { useAuth } from "../../context/AuthContext";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  profileId: "",
  active: true,
};

const UserForm = ({ onSuccess, editingUser, setEditingUser, onClose }) => {

  const [form, setForm] = useState(initialState);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { hasActionPermission } = useAuth();

  // Cargar perfiles disponibles
  useEffect(() => {
    getProfiles()
      .then(setProfiles)
      .catch(() => {
        // Si el endpoint de perfiles no existe, usar perfiles dummy
        setProfiles([
          { proId: 1, proName: "Administrador" },
          { proId: 2, proName: "Usuario" },
        ]);
      });
  }, []);

  // Rellenar formulario al editar
  useEffect(() => {
    if (editingUser) {
      setForm({
        firstName: editingUser.firstName ?? "",
        lastName: editingUser.lastName ?? "",
        email: editingUser.email ?? "",
        password: "",
        profileId: editingUser.profile?.proId ?? "",
        active: editingUser.profile?.proState === "A",
      });
    } else {
      setForm(initialState);
    }
    setError("");
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      ...(form.password ? { password: form.password } : {}),
      profileId: Number(form.profileId),
      state: form.active ? "A" : "I",
    };

    try {
      if (editingUser) {
        await updateUser(editingUser.email, payload);
        setEditingUser(null);
      } else {
        await createUser(payload);
      }
      setForm(initialState);
      onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ??
        "Ocurrió un error. Verifica los datos e intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialState);
    setError("");
    if (setEditingUser) setEditingUser(null);
    if (onClose) onClose();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span>{editingUser ? "✏" : "＋"}</span>
            {editingUser ? "Editar usuario" : "Nuevo usuario"}
          </h2>
          <button className={styles.closeBtn} onClick={handleClose} type="button">
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="firstName">Nombre</label>
              <input
                id="firstName"
                className={styles.input}
                type="text"
                name="firstName"
                placeholder="Ej: Cristian"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastName">Apellido</label>
              <input
                id="lastName"
                className={styles.input}
                type="text"
                name="lastName"
                placeholder="Ej: Díaz"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              name="email"
              placeholder="usuario@sweetnest.com"
              value={form.email}
              onChange={handleChange}
              required
              disabled={!!editingUser}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              {editingUser ? "Nueva contraseña (opcional)" : "Contraseña"}
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              name="password"
              placeholder={editingUser ? "Dejar en blanco para no cambiar" : "••••••••"}
              value={form.password}
              onChange={handleChange}
              {...(!editingUser ? { required: true } : {})}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="profileId">Perfil / Rol</label>
            <select
              id="profileId"
              className={styles.select}
              name="profileId"
              value={form.profileId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un perfil</option>
              {profiles.map((p) => (
                <option key={p.proId} value={p.proId}>
                  {p.proName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.toggleRow}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              <span className={styles.slider} />
            </label>
            <span className={styles.toggleLabel}>
              {form.active ? "Usuario activo" : "Usuario inactivo"}
            </span>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnSave}
              disabled={loading}
            >
              {loading ? "Guardando…" : editingUser ? "Actualizar" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
