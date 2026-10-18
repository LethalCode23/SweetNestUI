import { NavLink, Outlet, Link } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../js/roles";
import { getModuleIcon } from "../../../constants/moduleIcons";

/**
 * Extrae el segmento de ruta relativo de una URL.
 * Ej: "/admin/hotels" => "hotels" | "/hotels" => "hotels"
 */
const toRelativePath = (url = "") => url.replace(/^\/[^/]+\//, "").replace(/^\//, "");

export default function Dashboard() {

  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const { user, logout, modules, loadingModules } = useAuth();

  // Cierra el popover si se hace click fuera
  useEffect(() => {

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Iniciales del usuario para el avatar
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const roleLabel = user?.role === ROLES.ADMIN ? "Administrador" : "Usuario";
  const isOnline = !!user;

  // Solo los modulos con acceso permitido
  const allowedModules = modules.filter((m) => m.entryAllowed === true);

  return (
    <div className={styles.root}>
      <aside className={`${styles.sidebar} dark ${collapsed ? styles.collapsed : ""}`}>
        <Link to="/" className={styles.logo} aria-label="SweetNest — ir al inicio">
          <div className={styles.logoIcon}>S</div>
          <div className={styles.logoTexts}>
            <span className={styles.logoName}>SweetNest</span>
            <span className={styles.logoBadge}>{user?.role === ROLES.ADMIN ? "ADMIN" : "USER"}</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          {loadingModules ? (
            <span className={styles.navLabel} style={{ opacity: 0.5 }}>Cargando...</span>
          ) : allowedModules.length === 0 ? (
            <span className={styles.navLabel} style={{ opacity: 0.5 }}>Sin secciones</span>
          ) : (
            allowedModules.map((section) => (
              <div key={section.moduleName}>
                <span className={styles.navLabel}>{section.moduleName}</span>
                {(section.subModules ?? []).map((sub) => {
                  const relativePath = toRelativePath(sub.url);
                  const Icon = getModuleIcon(sub.name);
                  return (
                    <NavLink
                      key={sub.name}
                      to={relativePath}
                      className={({ isActive }) =>
                        `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                      }
                    >
                      <span className={styles.navIcon}>
                        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className={styles.navText}>{sub.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))
          )}
        </nav>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? "Expandir menu" : "Contraer menu"}
        >
          <span className={styles.collapseIcon}>
            {collapsed ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}
          </span>
        </button>
      </aside>

      <div className={styles.main}>
        <header className={`${styles.topbar} dark`}>
          <div className={styles.topbarLeft}>
            <span className={styles.topbarTitle}>Panel de administracion</span>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.onlineBadge}>
              <span className={styles.onlineDot} aria-hidden="true" />
              En linea
            </span>

            {/* Avatar con popover */}
            <div className={styles.avatarWrapper} ref={profileRef}>
              <div
                className={styles.avatar}
                onClick={() => setShowProfile(s => !s)}
                title="Ver perfil"
              >
                {initials}
              </div>

              {showProfile && (
                <div className={styles.profileCard}>
                  {/* Foto / avatar grande */}
                  <div className={styles.profileAvatarLg}>{initials}</div>

                  {/* Nombre + check de estado */}
                  <div className={styles.profileName}>
                    {user?.firstName} {user?.lastName}
                    <span className={`${styles.statusDot} ${isOnline ? styles.statusOnline : styles.statusOffline}`} title={isOnline ? "En linea" : "Desconectado"} />
                  </div>

                  {/* Rol */}
                  <span className={styles.profileRole}>{roleLabel}</span>

                  {/* Correo */}
                  <p className={styles.profileEmail}>{user?.email}</p>

                  <div className={styles.profileDivider} />

                  {/* Cerrar sesion */}
                  <button className={styles.logoutBtn} onClick={logout}>
                    Cerrar sesion
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}