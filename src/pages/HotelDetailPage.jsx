import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Share2, Heart, ChevronLeft } from "lucide-react";
import { listing } from "../constants/listingData";
import { findDetailById } from "../services/hotelServices/hotelService";
import { PhotoGallery } from "../components/HotelDetail/PhotoGallery";
import { BookingCard } from "../components/HotelDetail/BookingCard";
import { ListingContent } from "../components/HotelDetail/ListingContent";
import styles from "./HotelDetailPage.module.css";

const HotelDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await findDetailById(id);
        setHotel(res.data);
      } catch (err) {
        console.log("Error al cargar el detalle del hotel:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.stateMsg}>Cargando detalle del hotel...</div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.stateMsg}>No se pudo cargar el hotel.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back button + breadcrumb */}
        <div className={styles.breadcrumb}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeft size={18} />
            Volver
          </button>
        </div>

        {/* Title header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{hotel.name}</h1>
            <div className={styles.meta}>
              <div className={styles.ratingWrap}>
                <Star size={15} className={styles.starIcon} />
                <span className={styles.ratingNum}>{listing.rating}</span>
                <span className={styles.ratingDot}>·</span>
                <span className={styles.reviewLink}>{listing.reviews} reseñas</span>
              </div>
              <span className={styles.metaDot}>·</span>
              <span className={styles.location}>
                {hotel.city?.citName}, {hotel.address}
              </span>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <Share2 size={16} />
              <span>Compartir</span>
            </button>
            <button className={styles.actionBtn}>
              <Heart size={16} />
              <span>Guardar</span>
            </button>
          </div>
        </header>

        {/* Photo gallery */}
        <PhotoGallery hotel={hotel} />

        {/* Two-column layout */}
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <ListingContent hotel={hotel} />
          </div>
          <aside className={styles.sidebar}>
            <BookingCard hotel={hotel} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
