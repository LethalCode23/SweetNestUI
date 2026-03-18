import "../Footer/FooterComponent.css";

export const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-topbar" />

      <div className="footer-inner">
        <div className="footer-grid">

          {/* Marca */}
          <div className="footer-brand">
            <div className="brand-logo">
              Sweet<em>Nest</em>
              <span className="brand-dot" />
            </div>
            <p className="brand-tagline">
              Tu destino favorito para encontrar los mejores hoteles al mejor precio.
              Confirmación inmediata, sin sorpresas.
            </p>
            <div className="social-row">
              <a className="social-btn" href="#">in</a>
              <a className="social-btn" href="#">tw</a>
              <a className="social-btn" href="#">ig</a>
              <a className="social-btn" href="#">fb</a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <p className="footer-col-title">Navegación</p>
            <ul className="footer-links">
              <li><a href="/">Inicio</a></li>
              <li><a href="/hoteles">Hoteles</a></li>
              <li><a href="/ofertas">Ofertas</a></li>
              <li><a href="/cuenta">Mi cuenta</a></li>
              <li><a href="/reservas">Mis reservas</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="footer-col-title">Contacto</p>
            <div className="contact-item">
              <div className="contact-icon">✉</div>
              <div className="contact-text">
                <strong>Email</strong>
                info@sweetnest.com
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">☎</div>
              <div className="contact-text">
                <strong>Teléfono</strong>
                +1 (555) 123-4567
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">◎</div>
              <div className="contact-text">
                <strong>Horario</strong>
                Lun–Vie, 8am–8pm
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; {currentYear} <span>SweetNest</span>. Todos los derechos reservados.
        </p>
        <div className="footer-badge">
          Hecho con <span className="badge-heart">♥</span> para viajeros
        </div>
      </div>
    </footer>
  );
};