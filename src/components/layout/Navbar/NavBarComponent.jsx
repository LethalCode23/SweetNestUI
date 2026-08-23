import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext"; // ajusta la ruta según tu estructura real
import "../Navbar/NavBarComponent.css";
import { ROLES } from "../../../js/roles";

export const NavBarComponent = () => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    } catch { return false; }
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

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

  // Toma solo el primer nombre y el primer apellido, evita que el texto colapse
  const shortFirstName = user?.firstName?.trim().split(" ")[0] ?? "";
  const shortLastName = user?.lastName?.trim().split(" ")[0] ?? "";
  const shortFullName = `${shortFirstName} ${shortLastName}`.trim();

  // Iniciales del usuario para el avatar
  const initials = user
    ? `${shortFirstName?.[0] ?? ""}${shortLastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const roleLabel = user?.role === ROLES.ADMIN ? "ADMIN" : "USUARIO";

  const goTo = (path) => {
    setShowProfile(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">

        {/* Marca */}
        <NavLink to="/" className="navbar-brand" aria-label="Inicio">
          <div className="brand-logo-wrap">
            <span className="brand-logo-letter">S</span>
          </div>
          <span className="brand-name">Sweet<em>Nest</em></span>
        </NavLink>

        {/* Links centro */}
        <ul className="navbar-nav nav-center">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>
          </li>
        </ul>

        {/* Derecha */}
        <div className="nav-right">
          <div className="nav-divider" />

          {user ? (
            /* ===== Usuario logueado: avatar + popover ===== */
            <div className="avatar-wrapper" ref={profileRef}>

              <div
                className={`navbar-avatar${showProfile ? " is-hidden" : ""}`}
                onClick={() => setShowProfile(s => !s)}
                title="Ver perfil"
              >
                {initials}
              </div>

              {showProfile && (
                <div className="navbar-profile-card">
                  <div className="profile-header">
                    <div className="profile-avatar-lg">{initials}</div>
                    <div className="profile-header-text">
                      <div className="profile-name">
                        {shortFullName}
                        <span className="profile-role-badge">{roleLabel}</span>
                      </div>
                      <p className="profile-email">{user.email}</p>
                    </div>
                  </div>

                  <div className="profile-divider" />

                  <nav className="profile-menu">
                    <button className="profile-menu-item" onClick={() => goTo("/dashboard")}>
                      <span>Ir al Dashboard</span>
                    </button>
                    <button className="profile-menu-item" onClick={() => goTo("/dashboard/profile")}>
                      <span>Mi Perfil</span>
                    </button>
                    <button className="profile-menu-item" onClick={() => goTo("/dashboard/profile")}>
                      <span>Configuración</span>
                    </button>
                  </nav>

                  <div className="profile-divider" />

                  <button className="logout-btn" onClick={logout}>
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ===== Sin usuario: botones de auth ===== */
            <>
              <NavLink to="/register" className={({ isActive }) => `auth-btn auth-btn-ghost${isActive ? " active" : ""}`}>
                Registrarse
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => `auth-btn auth-btn-primary${isActive ? " active" : ""}`}>
                Iniciar sesión
              </NavLink>
            </>
          )}

          {/* Toggler mobile */}
          <button
            className={`navbar-toggler${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menú"
            aria-expanded={menuOpen}
          >
            <span className="toggler-bar" />
            <span className="toggler-bar" />
            <span className="toggler-bar" />
          </button>
        </div>

      </div>

      {/* Menú mobile */}
      <div className={`navbar-collapse${menuOpen ? " show" : ""}`}>
        <ul className="navbar-nav">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
        </ul>

        {user ? (
          <div className="mobile-profile">
            <div className="mobile-profile-info">
              <div className="navbar-avatar">{initials}</div>
              <div>
                <p className="profile-name">{shortFullName}</p>
                <span className="profile-role-badge">{roleLabel}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={() => { logout(); setMenuOpen(false); }}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="mobile-auth">
            <NavLink to="/register" className="auth-btn auth-btn-ghost" onClick={() => setMenuOpen(false)}>
              Registrarse
            </NavLink>
            <NavLink to="/login" className="auth-btn auth-btn-primary" onClick={() => setMenuOpen(false)}>
              Iniciar sesión
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};