import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
    return (
        <main className={styles.root}>
            <section className={styles.errorSection}>
                <span className={styles.code}>404</span>
            </section>

            <section className={styles.content}>
                <div className={styles.contentInner}>
                    <span className={styles.label}>ERROR 404</span>

                    <h1 className={styles.title}>
                        Página no encontrada
                    </h1>

                    <p className={styles.subtitle}>
                        Lo sentimos, la página que buscas no existe,
                        fue movida o ya no está disponible.
                    </p>

                    <Link to="/" className={styles.homeLink}>
                        Volver al inicio
                    </Link>
                </div>
            </section>
        </main>
    );
}