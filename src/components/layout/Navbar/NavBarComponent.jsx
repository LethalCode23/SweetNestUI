import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "../Navbar/NavBarComponent.css";

export const NavBarComponent = () => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    } catch { return false; }
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch {}
  }, [isDark]);

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
          {/* Agrega más rutas aquí */}
        </ul>

        {/* Derecha */}
        <div className="nav-right">
          {/* <button
            className="theme-toggle"
            onClick={() => setIsDark(s => !s)}
            aria-pressed={isDark}
            title="Cambiar tema"
          >
            {isDark ? "☀" : "🌙"}
          </button> */}

          <div className="nav-divider" />

          <NavLink to="/register" className={({ isActive }) => `auth-btn auth-btn-ghost${isActive ? " active" : ""}`}>
            Registrarse
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => `auth-btn auth-btn-primary${isActive ? " active" : ""}`}>
            Iniciar sesión
          </NavLink>

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
        <div className="mobile-auth">
          <NavLink to="/register" className="auth-btn auth-btn-ghost" onClick={() => setMenuOpen(false)}>
            Registrarse
          </NavLink>
          <NavLink to="/login" className="auth-btn auth-btn-primary" onClick={() => setMenuOpen(false)}>
            Iniciar sesión
          </NavLink>
        </div>
      </div>
    </nav>
  );
};