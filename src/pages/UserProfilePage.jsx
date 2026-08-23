import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./UserProfilePage.module.css";

export default function UserProfilePage() {

  const { user, saveUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
  });

  const [editingEmail, setEditingEmail] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Aquí iría la llamada al servicio de actualización del usuario
    // Por ahora actualizamos el contexto localmente
    const updatedUser = { ...user, firstName: form.firstName, lastName: form.lastName };
    saveUser({ user: updatedUser, auth: { token: localStorage.getItem("token") } });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
    });
    setAvatarPreview(null);
    setEditingEmail(false);
  };

  // Iniciales para el avatar
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className={styles.page}>

      {/* Header de la página */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Mi Cuenta</h1>
          <p className={styles.pageSubtitle}>Administra tu información personal y configuración de seguridad.</p>
        </div>
      </div>

      <form className={styles.card} onSubmit={handleSave}>

        {/* ─── Sección: Foto de Perfil ─── */}
        <section className={styles.section}>
          <div className={styles.avatarRow}>
            <div className={styles.avatarWrap}>
              {avatarPreview
                ? <img src={avatarPreview} alt="Avatar" className={styles.avatarImg} />
                : <div className={styles.avatarFallback}>{initials}</div>
              }
              <button
                type="button"
                className={styles.avatarCameraBtn}
                onClick={() => fileRef.current?.click()}
                title="Cambiar foto"
              >
                📷
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleFileChange}
              />
            </div>

            <div className={styles.avatarInfo}>
              <span className={styles.avatarTitle}>Foto de Perfil</span>
              <span className={styles.avatarHint}>Recomendado: JPG o PNG de al menos 400x400px.</span>
              <div className={styles.avatarActions}>
                <button
                  type="button"
                  className={styles.btnUpload}
                  onClick={() => fileRef.current?.click()}
                >
                  ↑ Subir Nueva
                </button>
                <button
                  type="button"
                  className={styles.btnRemove}
                  onClick={handleRemoveAvatar}
                  disabled={!avatarPreview}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ─── Sección: Información Personal ─── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>Información Personal</span>
            <span className={styles.sectionSubtitle}>Actualiza tus datos de contacto y nombre público.</span>
          </div>

          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="firstName">Nombre</label>
              <input
                id="firstName"
                className={styles.input}
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="lastName">Apellido</label>
              <input
                id="lastName"
                className={styles.input}
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Email row */}
          <div className={styles.fieldGroup}>
            <label className={styles.labelHighlight} htmlFor="email">Correo Electrónico</label>
            <div className={styles.emailRow}>
              <div className={styles.inputLockWrap}>
                <input
                  id="email"
                  className={`${styles.input} ${!editingEmail ? styles.inputLocked : ""}`}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  readOnly={!editingEmail}
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                />
                {!editingEmail && <span className={styles.lockIcon}>🔒</span>}
              </div>
              <button
                type="button"
                className={styles.btnEditEmail}
                onClick={() => setEditingEmail(e => !e)}
              >
                ✏ {editingEmail ? "Cancelar" : "Editar Email"}
              </button>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ─── Sección: Seguridad ─── */}
        <section className={styles.securitySection}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>Seguridad</span>
            <span className={styles.sectionSubtitle}>Gestiona tu contraseña y métodos de autenticación.</span>
          </div>
          <button type="button" className={styles.btnChangePass}>
            🔑 Cambiar Contraseña
          </button>
        </section>

        <div className={styles.divider} />

        {/* ─── Acciones ─── */}
        <div className={styles.formActions}>
          {saved && <span className={styles.savedBadge}>✓ Cambios guardados</span>}
          <div className={styles.actionBtns}>
            <button type="button" className={styles.btnCancel} onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave}>
              💾 Guardar Cambios
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
