import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getFavorites } from "../services/favoriteServices/favoriteService";
import { useFavorites } from "../context/FavoritesContext";
import { HotelCard } from "../components/Hotel/HotelCard";
import "../components/Hotel/HotelComponent.css";
import styles from "./FavoritesPage.module.css";

const PAGE_SIZE = 12;

/**
 * Favoritos del usuario del token. Se monta en dos lugares (submódulo RBAC "Mis favoritos"):
 * - /favoritos (sitio público): con su propio título.
 * - /dashboard/favorites (`inPanel`): sin <h1>, el header del panel ya muestra el título.
 */
const FavoritesPage = ({ inPanel = false }) => {
  const { ready, isFavorite } = useFavorites();
  const [page, setPage] = useState(0);
  // Subirlo vuelve a pedir la página actual (reintentar, o rellenar tras quitar).
  const [reloadKey, setReloadKey] = useState(0);
  // Resultado atado a la petición que lo pidió: si no coincide, está cargando.
  const [result, setResult] = useState({
    key: null,
    content: [],
    totalPages: 0,
    totalElements: 0,
    error: null,
  });
  const requestKey = `${page}:${reloadKey}`;

  useEffect(() => {
    let cancelled = false;
    const key = `${page}:${reloadKey}`;
    getFavorites(page, PAGE_SIZE)
      .then((res) => {
        if (!cancelled) {
          setResult({
            key,
            content: res?.content ?? [],
            totalPages: res?.totalPages ?? 0,
            totalElements: res?.totalElements ?? 0,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setResult({
            key,
            content: [],
            totalPages: 0,
            totalElements: 0,
            error: err.response?.data?.message ?? "No se pudieron cargar tus favoritos.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [page, reloadKey]);

  const loading = result.key !== requestKey;
  const { error } = result;

  // Al quitar el corazón desde esta página, la card desaparece sin recargar.
  const visible = ready
    ? result.content.filter((f) => isFavorite(f.hotel.hotSec))
    : result.content;
  const removedHere = result.content.length - visible.length;
  const total = Math.max(result.totalElements - removedHere, 0);

  // Si se quitaron todas las cards de la página, no mostrar "vacío" cuando hay más favoritos:
  // retroceder una página, o volver a pedir la primera (trae las que estaban en la siguiente).
  // Ajuste durante el render (patrón de React): al cambiar page/reloadKey cambia requestKey,
  // `loading` pasa a true y la condición deja de cumplirse → no hay bucle.
  const pageEmptied = !loading && ready && result.content.length > 0 && visible.length === 0;
  const hasMore = result.totalElements > result.content.length;
  if (pageEmptied && page > 0) {
    setPage(page - 1);
  } else if (pageEmptied && hasMore) {
    setReloadKey(reloadKey + 1);
  }

  const retry = () => setReloadKey((k) => k + 1);

  return (
    <section className={inPanel ? styles.panel : `hoteles ${styles.page}`}>
      <header className={styles.header}>
        {!inPanel && <h1 className={styles.title}>Mis favoritos</h1>}
        <p className={styles.subtitle}>
          {!loading && !error && total > 0
            ? `${total} ${total === 1 ? "alojamiento guardado" : "alojamientos guardados"}`
            : "Los alojamientos que guardaste para después."}
        </p>
      </header>

      {loading ? (
        <div className="cn-loading">Cargando favoritos...</div>
      ) : error ? (
        <div className={styles.stateCard} role="alert">
          <p className={styles.stateTitle}>Algo salió mal</p>
          <p className={styles.stateText}>{error}</p>
          <button type="button" className={styles.stateBtn} onClick={retry}>
            Reintentar
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className={styles.stateCard}>
          <span className={styles.stateIcon} aria-hidden="true">
            <Heart size={28} />
          </span>
          <p className={styles.stateTitle}>Todavía no tienes favoritos</p>
          <p className={styles.stateText}>
            Toca el corazón de un alojamiento para guardarlo y encontrarlo acá.
          </p>
          <Link to="/hoteles" className={styles.stateBtn}>
            Explorar alojamientos
          </Link>
        </div>
      ) : (
        <div className="hotel-grid">
          {visible.map((f) => (
            <HotelCard key={f.favSec} hotel={f.hotel} />
          ))}
        </div>
      )}

      {!loading && result.totalPages > 1 && (
        <div className="pagination">
          <button className="btnLeft" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <span>Página {page + 1} de {result.totalPages}</span>
          <button
            className="btnRight"
            disabled={page + 1 >= result.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
};

export default FavoritesPage;
