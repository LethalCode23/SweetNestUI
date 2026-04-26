import { useState } from "react";
import styles from "./RegisterPage.module.css";
import { registerUser } from "../../services/AuthServices/AuthServices.js";

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b67f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "El nombre es requerido";
    if (!form.lastName.trim()) errs.lastName = "El apellido es requerido";
    if (!form.email.trim()) {
      errs.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Correo inválido";
    }
    if (!form.password) {
      errs.password = "La contraseña es requerida";
    } else if (form.password.length < 8) {
      errs.password = "Mínimo 8 caracteres";
    }
    if (!accepted) errs.terms = "Debes aceptar los términos";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);

    try {

      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      
      setSuccess(true);
    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["rg-root"]}>

      {/* Panel izquierdo */}
      <div className={styles["rg-left"]}>
        <div className={styles["rg-brand"]}>
          <div className={styles["rg-brand-icon"]}>S</div>
          <span className={styles["rg-brand-name"]}>SweetNest</span>
        </div>
        <h1 className={styles["rg-left-title"]}>
          Tu próximo <span>escape</span><br />empieza aquí
        </h1>
        <p className={styles["rg-left-sub"]}>
          Únete a miles de viajeros que ya encontraron su hotel ideal. Precios exclusivos, sin cargos ocultos.
        </p>
        <div className={styles["rg-stats"]}>
          <div className={styles["rg-stat-item"]}>
            <span className={styles["rg-stat-num"]}>1.2K+</span>
            <span className={styles["rg-stat-label"]}>Hoteles</span>
          </div>
          <div className={styles["rg-divider"]} />
          <div className={styles["rg-stat-item"]}>
            <span className={styles["rg-stat-num"]}>48K</span>
            <span className={styles["rg-stat-label"]}>Reservas</span>
          </div>
          <div className={styles["rg-divider"]} />
          <div className={styles["rg-stat-item"]}>
            <span className={styles["rg-stat-num"]}>4.9★</span>
            <span className={styles["rg-stat-label"]}>Valoración</span>
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className={styles["rg-right"]}>
        <div className={styles["rg-form-wrap"]}>
          {success ? (
            <div className={styles["rg-success"]}>
              <div className={styles["rg-success-icon"]}><CheckIcon /></div>
              <h3>¡Cuenta creada!</h3>
              <p>Bienvenido a SweetNest, {form.firstName}.<br />Ya puedes iniciar sesión y buscar tu hotel ideal.</p>
            </div>
          ) : (
            <>
              <h2 className={styles["rg-form-title"]}>Crear cuenta</h2>
              <p className={styles["rg-form-sub"]}>
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles["rg-row"]}>
                  <div className={styles["rg-field"]}>
                    <label className={styles["rg-label"]}>Nombre</label>
                    <input
                      className={`${styles["rg-input"]}${errors.firstName ? ` ${styles["error"]}` : ""}`}
                      name="firstName"
                      type="text"
                      placeholder="Cristian"
                      value={form.firstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                    />
                    {errors.firstName && <span className={styles["rg-error"]}>{errors.firstName}</span>}
                  </div>
                  <div className={styles["rg-field"]}>
                    <label className={styles["rg-label"]}>Apellido</label>
                    <input
                      className={`${styles["rg-input"]}${errors.lastName ? ` ${styles["error"]}` : ""}`}
                      name="lastName"
                      type="text"
                      placeholder="Díaz"
                      value={form.lastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                    />
                    {errors.lastName && <span className={styles["rg-error"]}>{errors.lastName}</span>}
                  </div>
                </div>

                <div className={styles["rg-field"]}>
                  <label className={styles["rg-label"]}>Correo electrónico</label>
                  <input
                    className={`${styles["rg-input"]}${errors.email ? ` ${styles["error"]}` : ""}`}
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && <span className={styles["rg-error"]}>{errors.email}</span>}
                </div>

                <div className={styles["rg-field"]}>
                  <label className={styles["rg-label"]}>Contraseña</label>
                  <div className={styles["rg-password-wrap"]}>
                    <input
                      className={`${styles["rg-input"]}${errors.password ? ` ${styles["error"]}` : ""}`}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={styles["rg-eye"]}
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {errors.password
                    ? <span className={styles["rg-error"]}>{errors.password}</span>
                    : <span className={styles["rg-hint"]}>Usa letras, números y símbolos para mayor seguridad</span>
                  }
                </div>

                <label className={styles["rg-terms"]}>
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => {
                      setAccepted(e.target.checked);
                      if (errors.terms) setErrors((p) => ({ ...p, terms: "" }));
                    }}
                  />
                  <span>
                    Acepto los <a href="/terms">Términos y condiciones</a> y la <a href="/privacy">Política de privacidad</a> de SweetNest
                  </span>
                </label>
                {errors.terms && (
                  <p className={styles["rg-error"]} style={{ marginTop: "-12px", marginBottom: "12px" }}>{errors.terms}</p>
                )}

                {errors.api && (
                  <p className={styles["rg-error"]} style={{ marginBottom: "12px", textAlign: "center" }}>{errors.api}</p>
                )}

                <button className={styles["rg-btn"]} type="submit" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}