import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavorites } from "../services/favoriteServices/favoriteService";
import { useFavorites } from "../context/FavoritesContext";
import { HotelCard } from "../components/Hotel/HotelCard";
import "../components/Hotel/HotelComponent.css";
import styles from "./FavoritesPage.module.css";

const PAGE_SIZE = 12;

const FavoritesPage = () => {
  const { ready, isFavorite } = useFavorites();
  const [page, setPage] = useState(0);
  // Resultado atado a la página que lo pidió: si no coincide con `page`, está cargando.
  const [result, setResult] = useState({ page: null, content: [], totalPages: 0, error: null });

  useEffect(() => {
    let cancelled = false;
    getFavorites(page, PAGE_SIZE)
      .then((res) => {
        if (!cancelled) {
          setResult({ page, content: res?.content ?? [], totalPages: res?.totalPages ?? 0, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setResult({
            page,
            content: [],
            totalPages: 0,
            error: err.response?.data?.message ?? "No se pudieron cargar tus favoritos.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const loading = result.page !== page;
  const { error } = result;
  const data = result;

  // Al quitar el corazón desde esta página, la card desaparece sin recargar.
  const visible = ready
    ? data.content.filter((f) => isFavorite(f.hotel.hotSec))
    : data.content;

  return (
    <section className={`hoteles ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mis favoritos</h1>
        <p className={styles.subtitle}>Los alojamientos que guardaste para después.</p>
      </header>

      {loading ? (
        <div className="cn-loading">Cargando favoritos...</div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : visible.length === 0 ? (
        <div className={styles.empty}>
          <p>Todavía no tienes favoritos.</p>
          <Link to="/hoteles" className={styles.emptyLink}>Explorar alojamientos</Link>
        </div>
      ) : (
        <div className="hotel-grid">
          {visible.map((f) => (
            <HotelCard key={f.favSec} hotel={f.hotel} />
          ))}
        </div>
      )}

      {data.totalPages > 1 && (
        <div className="pagination">
          <button className="btnLeft" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <span>Página {page + 1} de {data.totalPages}</span>
          <button className="btnRight" disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
};

export default FavoritesPage;
