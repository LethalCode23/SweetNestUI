import { useState } from "react";
import { Grip, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Environment } from "../../Environments/Environment";
import styles from "./PhotoGallery.module.css";

export const PhotoGallery = ({ hotel }) => {
  const imageUrls = hotel?.imageUrls?.filter(Boolean) ?? [];

  const photos = imageUrls.length
    ? imageUrls.map((url, i) => ({
        src: Environment.API_URL_IMG + url,
        alt: i === 0 ? `Foto principal de ${hotel.name}` : `Foto ${i + 1} de ${hotel.name}`,
      }))
    : [{ src: "/hotel-placeholder.svg", alt: "Sin fotos disponibles" }];

  const [main, ...rest] = photos;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const goNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i + 1) % photos.length);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  return (
    <>
      <div className={styles.gallery}>
        <div className={styles.galleryGrid}>
          {/* Main large photo */}
          <div
            className={styles.mainPhoto}
            onClick={() => openLightbox(0)}
          >
            <img src={main.src} alt={main.alt} className={styles.photo} />
            <div className={styles.photoOverlay} />
          </div>

          {/* Secondary photos */}
          {rest.slice(0, 4).map((photo, i) => (
            <div
              key={photo.src}
              className={styles.secondaryPhoto}
              onClick={() => openLightbox(i + 1)}
            >
              <img src={photo.src} alt={photo.alt} className={styles.photo} />
              <div className={styles.photoOverlay} />
            </div>
          ))}
        </div>

        {/* Show all photos button */}
        {photos.length > 1 && (
          <button
            className={styles.showAllBtn}
            onClick={() => openLightbox(0)}
          >
            <Grip size={16} />
            Mostrar las {photos.length} fotos
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>
            <X size={24} />
          </button>

          <button
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={goPrev}
          >
            <ChevronLeft size={28} />
          </button>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].alt}
              className={styles.lightboxImg}
            />
            <p className={styles.lightboxCaption}>
              {photos[lightboxIndex].alt}
            </p>
            <span className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {photos.length}
            </span>
          </div>

          <button
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={goNext}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );
};
