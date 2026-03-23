import { useState } from "react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [tab, setTab] = useState("email");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ identifier: "", password: "", remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className={styles.page}>
      {/* Background blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      {/* Left branding */}
      <div className={styles.branding}>
        <div className={styles.brandLogo}>
          <div className={styles.brandIcon}>S</div>
          <span className={styles.brandName}>
            Sweet<span className={styles.brandAccent}>Nest</span>
          </span>
        </div>
        <p className={styles.brandTagline}>
          Encuentra tu escape<br />perfecto hoy
        </p>
        <div className={styles.brandStats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>1.2K+</span>
            <span className={styles.statLab}>Hoteles</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>48K</span>
            <span className={styles.statLab}>Reservas</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>4.9★</span>
            <span className={styles.statLab}>Valoración</span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Iniciar sesión</h2>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "email" ? styles.tabActive : ""}`}
            onClick={() => setTab("email")}
          >
            Correo
          </button>
          <button
            className={`${styles.tab} ${tab === "phone" ? styles.tabActive : ""}`}
            onClick={() => setTab("phone")}
          >
            Teléfono
          </button>
        </div>

        <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              {tab === "email" ? "Correo electrónico" : "Número de teléfono"}
            </label>
            <input
              className={styles.input}
              type={tab === "email" ? "email" : "tel"}
              name="identifier"
              placeholder={tab === "email" ? "correo@ejemplo.com" : "+57 300 000 0000"}
              value={form.identifier}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Contraseña</label>
              <a href="#" className={styles.forgot}>¿Olvidaste tu contraseña?</a>
            </div>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                className={styles.eyeBtn}
                type="button"
                onClick={() => setShowPass(s => !s)}
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span className={styles.checkLabel}>
              He leído y acepto los{" "}
              <a href="#" className={styles.link}>Términos de uso</a>
              {" "}y{" "}
              <a href="#" className={styles.link}>Política de privacidad</a>
            </span>
          </label>

          <button className={styles.submitBtn}>
            Iniciar sesión
          </button>
        </div>

        <p className={styles.registerRow}>
          ¿No tienes cuenta?{" "}
          <a href="#" className={styles.link}>Regístrate</a>
        </p>
      </div>
    </div>
  );
}