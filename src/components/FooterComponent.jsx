import "../styles/FooterComponent.css";

export const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>SweetNest</h4>
          <p>Tu destino favorito para encontrar los mejores hoteles.</p>
        </div>
        
        <div className="footer-section">
          <h4>Enlaces útiles</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Email: info@sweetnest.com</p>
          <p>Teléfono: +1 (555) 123-4567</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} SweetNest. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
