import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useState, useRef, useEffect } from "react";
import {
  ChevronsUpDown,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../js/roles";
import { getModuleIcon } from "../../../constants/moduleIcons";

/**
 * Extrae el segmento de ruta relativo de una URL.
 * Ej: "/admin/hotels" => "hotels" | "/hotels" => "hotels"
 */
const toRelativePath = (url = "") => url.replace(/^\/[^/]+\//, "").replace(/^\//, "");

const COLLAPSED_KEY = "sn.sidebar.collapsed";
const MOBILE_QUERY = "(max-width: 899px)";

// Títulos de rutas del panel que no son submódulos del menú
const FALLBACK_TITLES = {
  "": "Panel",
  userProfile: "Mi perfil",
  profiles: "Permisos", // /dashboard/profiles/:id/permissions
};

/** Título del header a partir de la ruta actual y los submódulos del perfil. */
const resolveTitle = (pathname, modules) => {
  const rest = pathname.replace(/^\/dashboard\/?/, "");
  const segment = rest.split("/")[0] ?? "";

  if (segment === "profiles" && rest.includes("/permissions")) return FALLBACK_TITLES.profiles;

  for (const section of modules) {
    const match = (section.subModules ?? []).find((sub) => toRelativePath(sub.url) === segment);
    if (match) return match.name;
  }
  return FALLBACK_TITLES[segment] ?? "Panel";
};

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSED_KEY) === "1");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const { pathname } = useLocation();
  const { user, logout, modules, loadingModules } = useAuth();

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  // Al navegar se cierran el off-canvas (móvil) y el popover
  const closeOverlays = () => {
    setMobileOpen(false);
    setShowProfile(false);
  };

  // Click fuera cierra el popover; Esc cierra popover y off-canvas
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setShowProfile(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const toggleSidebar = () => {
    if (window.matchMedia(MOBILE_QUERY).matches) setMobileOpen((o) => !o);
    else setCollapsed((c) => !c);
  };

  // En móvil el sidebar siempre se muestra expandido
  const isCollapsed = collapsed && !mobileOpen;

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?"
    : "?";
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Mi cuenta";
  const roleLabel = user?.role === ROLES.ADMIN ? "Administrador" : "Usuario";

  // Solo los módulos con acceso permitido
  const allowedModules = modules.filter((m) => m.entryAllowed === true);
  const title = resolveTitle(pathname, allowedModules);

  const sidebarClass = [
    styles.sidebar,
    isCollapsed ? styles.collapsed : "",
    mobileOpen ? styles.mobileOpen : "",
  ].join(" ");

  return (
    <div className={styles.root}>
      {mobileOpen && (
        <div className={styles.scrim} onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <aside id="sn-sidebar" className={sidebarClass}>
        <Link to="/" className={styles.logo} aria-label="SweetNest, ir al inicio" title="Ir al sitio">
          <span className={styles.logoMark} aria-hidden="true">S</span>
          <span className={styles.logoName}>SweetNest</span>
        </Link>

        <nav className={styles.nav} aria-label="Secciones del panel">
          {loadingModules ? (
            <p className={styles.navState}>Cargando secciones…</p>
          ) : allowedModules.length === 0 ? (
            <p className={styles.navState}>Tu perfil no tiene secciones asignadas.</p>
          ) : (
            allowedModules.map((section) => (
              <div key={section.moduleName} className={styles.navGroup}>
                <span className={styles.navLabel}>{section.moduleName}</span>
                {(section.subModules ?? []).map((sub) => {
                  const Icon = getModuleIcon(sub.name);
                  return (
                    <NavLink
                      key={sub.name}
                      to={toRelativePath(sub.url)}
                      title={isCollapsed ? sub.name : undefined}
                      onClick={closeOverlays}
                      className={({ isActive }) =>
                        `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                      }
                    >
                      <Icon className={styles.navIcon} size={18} strokeWidth={1.75} aria-hidden="true" />
                      <span className={styles.navText}>{sub.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))
          )}
        </nav>

        <div className={styles.account} ref={profileRef}>
          <button
            type="button"
            className={styles.accountBtn}
            onClick={() => setShowProfile((s) => !s)}
            aria-expanded={showProfile}
            aria-haspopup="true"
            title={isCollapsed ? fullName : undefined}
          >
            <span className={styles.avatar} aria-hidden="true">{initials}</span>
            <span className={styles.accountTexts}>
              <span className={styles.accountName}>{fullName}</span>
              <span className={styles.accountRole}>{roleLabel}</span>
            </span>
            <ChevronsUpDown className={styles.accountChevron} size={16} aria-hidden="true" />
          </button>

          {showProfile && (
            <div className={styles.popover} role="menu">
              <div className={styles.popoverHead}>
                <span className={styles.popoverName}>{fullName}</span>
                <span className={styles.popoverEmail}>{user?.email}</span>
              </div>
              <Link to="userProfile" className={styles.popoverItem} role="menuitem" onClick={closeOverlays}>
                <UserRound size={16} aria-hidden="true" />
                Mi perfil
              </Link>
              <button
                type="button"
                className={`${styles.popoverItem} ${styles.popoverDanger}`}
                onClick={logout}
                role="menuitem"
              >
                <LogOut size={16} aria-hidden="true" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className={styles.sheet}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.toggle}
            onClick={toggleSidebar}
            aria-controls="sn-sidebar"
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          >
            <Menu className={styles.toggleMobile} size={20} aria-hidden="true" />
            {collapsed ? (
              <PanelLeftOpen className={styles.toggleDesktop} size={20} aria-hidden="true" />
            ) : (
              <PanelLeftClose className={styles.toggleDesktop} size={20} aria-hidden="true" />
            )}
          </button>
          <h1 className={styles.title}>{title}</h1>
          {/* Reservado para acciones de cada página (próxima fase) */}
          <div className={styles.headerActions} />
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
