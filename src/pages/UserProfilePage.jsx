import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MODULES } from "../constants/modules";
import { StatusBadge } from "../components/ui/StatusBadge/StatusBadge";
import ui from "../components/ui/catalog.module.css";
import styles from "./UserProfilePage.module.css";

/** Mi perfil: datos de la cuenta logueada (solo lectura). */
export default function UserProfilePage() {
  const { user, hasSubmodulePermission } = useAuth();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Sin nombre";
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const profileName = user?.profile?.proName;
  const canSeeFavorites = hasSubmodulePermission(MODULES.FAVORITES);

  const rows = [
    { label: "Nombre", value: user?.firstName },
    { label: "Apellido", value: user?.lastName },
    { label: "Correo electrónico", value: user?.email },
    { label: "Perfil", value: profileName },
  ];

  return (
    <div className={ui.page}>
      <p className={ui.intro}>Los datos de tu cuenta en SweetNest. Si algo está mal, pídele a un administrador que lo corrija.</p>

      <section className={styles.card} aria-labelledby="account-name">
        <header className={styles.identity}>
          <span className={styles.avatar} aria-hidden="true">{initials}</span>
          <div className={styles.identityText}>
            <h2 id="account-name" className={styles.name}>{fullName}</h2>
            {user?.email && <p className={styles.email}>{user.email}</p>}
            <div className={styles.badges}>
              {profileName && <StatusBadge tone="neutral">{profileName}</StatusBadge>}
              {user?.host === "S" && <StatusBadge tone="info">Anfitrión</StatusBadge>}
            </div>
          </div>
        </header>

        <dl className={styles.details}>
          {rows.map((r) => (
            <div key={r.label} className={styles.detailRow}>
              <dt className={styles.term}>{r.label}</dt>
              <dd className={styles.value}>{r.value || <span className={ui.empty}>—</span>}</dd>
            </div>
          ))}
        </dl>

        {canSeeFavorites && (
          <footer className={styles.footer}>
            <Link to="/dashboard/favorites" className="sn-btn sn-btn--secondary">
              <Heart size={16} aria-hidden="true" />
              Mis favoritos
            </Link>
          </footer>
        )}
      </section>
    </div>
  );
}
