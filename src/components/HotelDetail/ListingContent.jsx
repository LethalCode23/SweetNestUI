import {
  KeyRound,
  MapPin,
  CalendarCheck,
  ShieldCheck,
  BadgeCheck,
  BedDouble,
  Clock,
  Check,
} from "lucide-react";
import { listing } from "../../constants/listingData";
import styles from "./ListingContent.module.css";

const highlightIcons = [KeyRound, MapPin, CalendarCheck, ShieldCheck];

export const ListingContent = ({ hotel }) => {
  return (
    <div className={styles.content}>
      {/* Host + highlights */}
      <section className={styles.section}>
        <div className={styles.hostHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              Anfitrión: {listing.host.name}
            </h2>
            <p className={styles.hostMeta}>
              Superhost certificado · {listing.host.years} años brindando
              hospitalidad · Tiempo de respuesta: {listing.host.responseTime}
            </p>
          </div>
          <div className={styles.avatarWrap}>
            <img
              src={listing.host.avatar}
              alt={`Foto de ${listing.host.name}`}
              className={styles.avatar}
            />
            {listing.host.superhost && (
              <span className={styles.superhostBadge}>
                <BadgeCheck size={14} />
              </span>
            )}
          </div>
        </div>

        <div className={styles.highlightsGrid}>
          {listing.highlights.map((h, i) => {
            const Icon = highlightIcons[i] ?? ShieldCheck;
            return (
              <div key={h.title} className={styles.highlight}>
                <Icon size={20} className={styles.highlightIcon} />
                <div>
                  <h3 className={styles.highlightTitle}>{h.title}</h3>
                  <p className={styles.highlightBody}>{h.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sobre este alojamiento</h2>
        {hotel?.description ? (
          <div className={styles.aboutText}>
            <p>{hotel.description}</p>
          </div>
        ) : (
          <div className={styles.aboutText}>
            <p>
              Disfruta de una experiencia exclusiva en este loft arquitectónico
              completamente renovado, ubicado en una calle tranquila y arborizada
              del corazón bohemio de Chapinero. Diseñado pensando en nómadas
              digitales y viajeros exigentes, cuenta con luz natural durante todo
              el día, detalles rústicos en ladrillo a la vista y comodidades de
              primer nivel.
            </p>
            <p>
              A pasos de los mejores restaurantes de la Zona G, galerías de arte y
              cafeterías de especialidad de Bogotá. Relájate en la terraza privada
              con un café recién tostado mientras disfrutas del clima de la
              capital.
            </p>
          </div>
        )}
      </section>

      {/* Categories */}
      {hotel?.categories?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Categorías</h2>
          <div className={styles.categoryList}>
            {hotel.categories
              .filter((cat) => cat.catEst === "A")
              .map((cat) => (
                <span key={cat.catSec} className={styles.categoryChip}>
                  {cat.catName}
                </span>
              ))}
          </div>
        </section>
      )}

      {/* Amenities */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Lo que este alojamiento ofrece</h2>
        <div className={styles.verifiedBadge}>
          <BadgeCheck size={14} />
          Instalaciones y amenidades verificadas por el equipo SweetNest
        </div>
        {hotel?.features?.length > 0 ? (
          <ul className={styles.amenitiesList}>
            {hotel.features
              .filter((fea) => fea.feaEst === "A")
              .map((fea) => (
                <li key={fea.feaSec} className={styles.amenityItem}>
                  <Check size={20} className={styles.amenityCheck} />
                  {fea.feaName}
                </li>
              ))}
          </ul>
        ) : (
          <ul className={styles.amenitiesList}>
            {listing.amenities.map((a) => (
              <li key={a} className={styles.amenityItem}>
                <Check size={20} className={styles.amenityCheck} />
                {a}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Where you sleep */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>¿Dónde vas a dormir?</h2>
        <div className={styles.sleepCard}>
          <BedDouble size={24} className={styles.bedIcon} />
          <h3 className={styles.sleepTitle}>Habitación Principal</h3>
          <p className={styles.sleepDesc}>
            1 cama Queen size con sábanas de 400 hilos y edredón nórdico
            hipoalergénico.
          </p>
        </div>
      </section>

      {/* Rules */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Normas y Políticas del Hotel</h2>
        <ul className={styles.rulesList}>
          {listing.rules.map((r) => (
            <li key={r} className={styles.ruleItem}>
              <Clock size={16} className={styles.ruleIcon} />
              {r}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
