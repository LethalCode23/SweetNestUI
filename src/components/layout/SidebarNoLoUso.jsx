import { NavLink } from "react-router-dom";
import {
  Building2,
  Globe,
  Map,
  MapPin,
  Tag,
  LayoutDashboard,
} from "lucide-react";

import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/hotels", icon: Building2, label: "Hoteles" },
  { to: "/admin/countries", icon: Globe, label: "Países" },
  { to: "/admin/departments", icon: Map, label: "Departamentos" },
  { to: "/admin/cities", icon: MapPin, label: "Ciudades" },
  { to: "/admin/categories", icon: Tag, label: "Categorías" },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>S</div>
        <span className={styles.logoText}>SweetNest</span>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navGroup}>General</p>
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <Icon size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userAvatar}>A</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Admin</span>
          <span className={styles.userRole}>Administrador</span>
        </div>
      </div>
    </aside>
  );
}
