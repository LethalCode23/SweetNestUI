import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getHotelReviews, getMyReview, saveReview } from "../../../services/reviewServices/reviewService";
import { formatRating, formatReviewDate, ratingCountLabel } from "../../../Utils/rating";
import { StarRating } from "./StarRating";
import { StarInput } from "./StarInput";
import styles from "./HotelReviews.module.css";

const PAGE_SIZE = 5;
const COMMENT_MAX = 1000;

/**
 * HU #28 — Sección de valoraciones del detalle del hotel (id="resenas").
 * Resumen (promedio, cantidad, distribución) + formulario según el estado del usuario + lista paginada.
 * Al guardar, el backend devuelve el resumen ya recalculado y se avisa al padre (onSummaryChange)
 * para que el encabezado y el BookingCard muestren el promedio nuevo al instante.
 */
export const HotelReviews = ({ hotSec, onSummaryChange }) => {
  const { user } = useAuth();
  const location = useLocation();

  const [summary, setSummary] = useState(null); // { ratingAvg, ratingCount, distribution }
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [mine, setMine] = useState(null); // { canReview, review }
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [starsError, setStarsError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [highlight, setHighlight] = useState(null);

  const applyResponse = (data, { append = false } = {}) => {
    const { ratingAvg, ratingCount, distribution, reviews: pageData } = data;
    setSummary({ ratingAvg, ratingCount, distribution });
    setReviews((prev) => (append ? [...prev, ...pageData.content] : pageData.content));
    setPage(pageData.number ?? 0);
    setHasMore(!pageData.last);
  };

  // Resumen + primera página (público)
  useEffect(() => {
    let alive = true;
    getHotelReviews(hotSec, 0, PAGE_SIZE)
      .then((data) => alive && applyResponse(data))
      .catch(() => alive && setLoadError(true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [hotSec]);

  // Estado del usuario: si puede valorar y su reseña actual (para precargar el form)
  useEffect(() => {
    if (!user) return undefined;
    let alive = true;
    getMyReview(hotSec)
      .then((data) => {
        if (!alive) return;
        setMine(data);
        if (data?.review) {
          setStars(data.review.stars);
          setComment(data.review.comment ?? "");
        }
      })
      .catch(() => alive && setMine({ canReview: false, review: null }));
    return () => { alive = false; };
  }, [hotSec, user]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      applyResponse(await getHotelReviews(hotSec, page + 1, PAGE_SIZE), { append: true });
    } catch {
      setNotice("No se pudieron cargar más reseñas. Intenta de nuevo.");
    } finally {
      setLoadingMore(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (stars < 1) {
      setStarsError("Elige de 1 a 5 estrellas.");
      return;
    }
    const isUpdate = Boolean(mine?.review);
    setSaving(true);
    setFormError(null);
    setNotice("");
    try {
      const data = await saveReview(hotSec, { stars, comment: comment.trim() });
      applyResponse(data);
      onSummaryChange?.({ ratingAvg: data.ratingAvg, ratingCount: data.ratingCount });
      const updated = await getMyReview(hotSec);
      setMine(updated);
      setHighlight(updated?.review?.revSec ?? null);
      setNotice(isUpdate ? "Reseña actualizada." : "Reseña publicada.");
    } catch (err) {
      setFormError(err.response?.data?.message ?? "No se pudo guardar tu reseña. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const count = summary?.ratingCount ?? 0;
  const maxBar = Math.max(1, ...(summary?.distribution ?? [0]));

  const renderPanel = () => {
    if (!user) {
      return (
        <div className={styles.panel}>
          <p className={styles.panelTitle}>¿Ya te hospedaste aquí?</p>
          <p className={styles.panelText}>Inicia sesión para valorar este alojamiento y contar tu experiencia.</p>
          <Link to="/login" state={{ from: location }} className={styles.primaryBtn}>
            Iniciar sesión
          </Link>
        </div>
      );
    }
    if (!mine) {
      return <div className={styles.panel}><p className={styles.panelText}>Revisando si puedes valorar…</p></div>;
    }
    if (!mine.canReview) {
      return (
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Todavía no puedes valorar</p>
          <p className={styles.panelText}>
            Podrás valorar este alojamiento cuando termine tu estadía.
          </p>
        </div>
      );
    }
    const isUpdate = Boolean(mine.review);
    return (
      <form className={styles.panel} onSubmit={submit} noValidate>
        <p className={styles.panelTitle}>{isUpdate ? "Tu reseña" : "Cuéntanos cómo te fue"}</p>
        <StarInput value={stars} onChange={(n) => { setStars(n); setStarsError(null); }} error={starsError} />

        <div className={styles.commentField}>
          <label htmlFor={`review-comment-${hotSec}`} className={styles.commentLabel}>
            Tu reseña <span className={styles.optional}>(opcional)</span>
          </label>
          <textarea
            id={`review-comment-${hotSec}`}
            className={styles.textarea}
            rows={4}
            maxLength={COMMENT_MAX}
            value={comment}
            placeholder="Qué te gustó, qué mejorarías, a quién se lo recomendarías…"
            onChange={(e) => setComment(e.target.value)}
          />
          <span className={styles.counter}>{comment.length} / {COMMENT_MAX}</span>
        </div>

        {formError && (
          <p className={styles.formError} role="alert">{formError}</p>
        )}

        <button type="submit" className={styles.primaryBtn} disabled={saving}>
          {saving ? "Guardando…" : isUpdate ? "Actualizar reseña" : "Publicar reseña"}
        </button>
      </form>
    );
  };

  return (
    <section id="resenas" className={styles.reviews} aria-labelledby="hotel-reviews-title">
      <h2 id="hotel-reviews-title" className={styles.title}>Valoraciones</h2>

      {loading ? (
        <p className={styles.muted}>Cargando valoraciones…</p>
      ) : loadError ? (
        <p className={styles.muted}>No se pudieron cargar las valoraciones. Recarga la página para intentarlo de nuevo.</p>
      ) : (
        <div className={styles.layout}>
          {/* Resumen */}
          <div className={styles.summary}>
            {count > 0 ? (
              <>
                <div className={styles.average}>
                  <span className={styles.averageNum}>{formatRating(summary.ratingAvg)}</span>
                  <div className={styles.averageMeta}>
                    <StarRating value={summary.ratingAvg} size={20} />
                    <span className={styles.countLabel}>{ratingCountLabel(count)}</span>
                  </div>
                </div>
                <ul className={styles.distribution}>
                  {summary.distribution.map((n, i) => {
                    const starsN = 5 - i;
                    return (
                      <li key={starsN} className={styles.distRow}
                        aria-label={`${starsN} ${starsN === 1 ? "estrella" : "estrellas"}: ${ratingCountLabel(n)}`}>
                        <span className={styles.distStars} aria-hidden="true">{starsN}</span>
                        <span className={styles.distTrack} aria-hidden="true">
                          <span className={styles.distFill} style={{ width: `${(n / maxBar) * 100}%` }} />
                        </span>
                        <span className={styles.distCount} aria-hidden="true">{n}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <div className={styles.noRatings}>
                <StarRating value={0} size={20} />
                <p className={styles.panelTitle}>Sin valoraciones todavía</p>
                <p className={styles.panelText}>Las opiniones de quienes se hospeden aquí aparecerán en esta sección.</p>
              </div>
            )}
          </div>

          {/* Formulario + lista */}
          <div className={styles.main}>
            {renderPanel()}

            <p className={styles.notice} role="status" aria-live="polite">{notice}</p>

            {reviews.length > 0 && (
              <ul className={styles.list}>
                {reviews.map((r) => (
                  <li key={r.revSec} className={`${styles.item} ${highlight === r.revSec ? styles.itemHighlight : ""}`}>
                    <div className={styles.itemHead}>
                      <StarRating value={r.stars} size={15} />
                      <span className={styles.itemName}>{r.userName}</span>
                      <time className={styles.itemDate} dateTime={r.date}>{formatReviewDate(r.date)}</time>
                    </div>
                    {r.comment && <p className={styles.itemComment}>{r.comment}</p>}
                  </li>
                ))}
              </ul>
            )}

            {hasMore && (
              <button type="button" className={styles.moreBtn} onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Cargando…" : "Ver más reseñas"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HotelReviews;
