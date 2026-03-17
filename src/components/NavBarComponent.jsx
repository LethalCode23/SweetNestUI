
import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react";
import "../styles/NavBarComponent.css"

export const NavBarComponent = () => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) { return false; }
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
  }, [isDark]);

  const toggleTheme = () => setIsDark((s) => !s);
  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <div className="brand-area">
          <NavLink to='/' className="navbar-brand" aria-label="Inicio">
            <img src="/favicon.ico" alt="SweetNest favicon" className="brand-logo" />
            <span className="brand-name">SweetNest</span>
          </NavLink>
        </div>
        <div style={{ position: 'absolute', top: 12, right: 18, zIndex: 100 }}>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <span className="navbar-toggler-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="6" width="28" height="3" rx="1.5" fill="#888" />
                <rect y="13" width="28" height="3" rx="1.5" fill="#888" />
                <rect y="20" width="28" height="3" rx="1.5" fill="#888" />
              </svg>
            </span>
          </button>
        </div>

        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} aria-current="page">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/countries' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Países</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/departments' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Departamentos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/hotels' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Hoteles</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/cities' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Ciudades</NavLink>
            </li>
          </ul>
          <div className="auth-buttons">
            <NavLink to='/register' className={({ isActive }) => isActive ? 'auth-btn active' : 'auth-btn'}>Registrarse</NavLink>
            <NavLink to='/login' className={({ isActive }) => isActive ? 'auth-btn primary active' : 'auth-btn primary'}>Iniciar sesión</NavLink>
          </div>
        </div>
        
      </div>
    </nav>
  );
}