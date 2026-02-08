
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

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
  }, [isDark]);

  const toggleTheme = () => setIsDark((s) => !s);

    return (

        <nav className="navbar">
            <div className="container-fluid">
                <div className="brand-area">
                  {/* <button
                    className="theme-toggle brand-toggle"
                    onClick={toggleTheme}
                    aria-pressed={isDark}
                    aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    title={isDark ? 'Modo oscuro activado' : 'Modo claro activado'}
                  >
                    {isDark ? '🌙' : '☀️'}
                  </button> */}
                  <NavLink to='/' className="navbar-brand" aria-label="Inicio">
                    <img src="/favicon.ico" alt="SweetNest favicon" className="brand-logo" />
                    <span className="brand-name">SweetNest</span>
                  </NavLink>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
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
                    </ul>
                    <div className="auth-buttons">
                      <NavLink to='/register' className={({ isActive }) => isActive ? 'auth-btn active' : 'auth-btn'}>Registrarse</NavLink>
                      <NavLink to='/login' className={({ isActive }) => isActive ? 'auth-btn primary active' : 'auth-btn primary'}>Iniciar sesión</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}