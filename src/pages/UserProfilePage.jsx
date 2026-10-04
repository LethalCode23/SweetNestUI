import { useAuth } from "../context/AuthContext";
import styles from "./UserProfilePage.module.css";

export default function UserProfilePage() {

  const { user } = useAuth();

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
          <p className={styles.pageSubtitle}>Consulta tu información personal.</p>
        </div>
      </div>

      <div className={styles.card}>

        {/* ─── Sección: Foto de Perfil ─── */}
        <section className={styles.section}>
          <div className={styles.avatarRow}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatarFallback}>{initials}</div>
            </div>

            <div className={styles.avatarInfo}>
              <span className={styles.avatarTitle}>Foto de Perfil</span>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ─── Sección: Información Personal ─── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>Información Personal</span>
            <span className={styles.sectionSubtitle}>Tus datos registrados.</span>
          </div>

          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="firstName">Nombre</label>
              <input
                id="firstName"
                className={styles.input}
                type="text"
                value={user?.firstName ?? ""}
                readOnly
                autoComplete="given-name"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="lastName">Apellido</label>
              <input
                id="lastName"
                className={styles.input}
                type="text"
                value={user?.lastName ?? ""}
                readOnly
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={user?.email ?? ""}
              readOnly
              autoComplete="email"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
