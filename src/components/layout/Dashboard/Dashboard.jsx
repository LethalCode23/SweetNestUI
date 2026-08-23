import { NavLink, Outlet } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../js/roles";

// Mapa de iconos para sub-modulos por nombre (fallback a icono generico)
const MODULE_ICONS = {
  hotels: "⌂",
  countries: "◉",
  departments: "❖",
  cities: "◈",
  categories: "◆",
  users: "👥",
  profile: "👤",
  userProfile: "👤",
  profiles: "👥",
  PermissionsPage: "👥",
};

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

  console.log(modules);
  console.log(loadingModules);

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
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>S</div>
          <div className={styles.logoTexts}>
            <span className={styles.logoName}>SweetNest</span>
            <span className={styles.logoBadge}>{user?.role === ROLES.ADMIN ? "ADMIN" : "USER"}</span>
          </div>
        </div>

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
                  const icon = MODULE_ICONS[sub.name] ?? "■";
                  return (
                    <NavLink
                      key={sub.name}
                      to={relativePath}
                      className={({ isActive }) =>
                        `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                      }
                    >
                      <span className={styles.navIcon}>{icon}</span>
                      <span className={styles.navText}>{sub.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))
          )}
        </nav>

        <button className={styles.collapseBtn} onClick={() => setCollapsed(c => !c)}>
          <span className={styles.collapseIcon}>{collapsed ? "›" : "‹"}</span>
        </button>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.topbarTitle}>Panel de administracion</span>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.onlineBadge}>● En linea</span>

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