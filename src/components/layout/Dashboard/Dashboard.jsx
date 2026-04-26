import { NavLink, Outlet } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
 
const NAV_ITEMS = [

  { path: "hotels",      label: "Hoteles",        icon: "⌂" },
  { path: "countries",   label: "Países",          icon: "◉" },
  { path: "departments", label: "Departamentos",   icon: "❖" },
  { path: "cities",      label: "Ciudades",        icon: "◈" },
];
 
export default function AdminDashboard() {

  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const { user, logout } = useAuth();
 
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
    ? `${user.userFirstName?.[0] ?? ""}${user.userLastName?.[0] ?? ""}`.toUpperCase()
    : "?";
 
  const roleLabel = user?.userRole === "ADMIN" ? "Administrador" : "Usuario";
  const isOnline  = !!user;
 
  return (
    <div className={styles.root}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>S</div>
          <div className={styles.logoTexts}>
            <span className={styles.logoName}>SweetNest</span>
            <span className={styles.logoBadge}>ADMIN</span>
          </div>
        </div>
 
        <nav className={styles.nav}>
          <span className={styles.navLabel}>Gestión</span>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
 
        <button className={styles.collapseBtn} onClick={() => setCollapsed(c => !c)}>
          <span className={styles.collapseIcon}>{collapsed ? "›" : "‹"}</span>
        </button>
      </aside>
 
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.topbarTitle}>Panel de administración</span>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.onlineBadge}>● En línea</span>
 
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
                    {user?.userFirstName} {user?.userLastName}
                    <span className={`${styles.statusDot} ${isOnline ? styles.statusOnline : styles.statusOffline}`} title={isOnline ? "En línea" : "Desconectado"} />
                  </div>
 
                  {/* Rol */}
                  <span className={styles.profileRole}>{roleLabel}</span>
 
                  {/* Correo */}
                  <p className={styles.profileEmail}>{user?.userEmail}</p>
 
                  <div className={styles.profileDivider} />
 
                  {/* Cerrar sesión */}
                  <button className={styles.logoutBtn} onClick={logout}>
                    Cerrar sesión
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