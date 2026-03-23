import { NavLink, Outlet } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useState } from "react";
 
const NAV_ITEMS = [
  { path: "hotels",      label: "Hoteles",        icon: "⌂" },
  { path: "countries",   label: "Países",          icon: "◉" },
  { path: "departments", label: "Departamentos",   icon: "❖" },
  { path: "cities",      label: "Ciudades",        icon: "◈" },
];
 
export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
 
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
            <div className={styles.avatar}>A</div>
          </div>
        </header>
 
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}