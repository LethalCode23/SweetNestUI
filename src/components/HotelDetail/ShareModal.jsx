import { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import { X, Copy, Check, Share2, MapPin } from "lucide-react";
import { Environment } from "../../Environments/Environment";
import styles from "./ShareModal.module.css";

const MAX_MESSAGE = 280;
const DESC_LENGTH = 140;

const truncate = (text = "", max = DESC_LENGTH) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

const defaultMessage = (hotel) => {
  const city = hotel?.city?.citName;
  return `Mira este alojamiento en SweetNest: ${hotel?.name ?? ""}${city ? ` en ${city}` : ""}`;
};

/** Redes con URL de compartir. Facebook solo toma la URL (ignora el texto). */
const NETWORKS = [
  {
    key: "facebook",
    label: "Facebook",
    Icon: FacebookIcon,
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: "x",
    label: "X",
    Icon: XIcon,
    href: (url, msg) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(url)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    Icon: WhatsAppIcon,
    href: (url, msg) => `https://wa.me/?text=${encodeURIComponent(`${msg} ${url}`)}`,
  },
  {
    key: "telegram",
    label: "Telegram",
    Icon: TelegramIcon,
    href: (url, msg) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(msg)}`,
  },
];

/**
 * Modal para compartir un alojamiento: vista previa (imagen, nombre, descripción breve),
 * mensaje personalizado, redes sociales y copiar enlace.
 */
export const ShareModal = ({ open, onClose, hotel, url }) => {
  const fullScreen = useMediaQuery("(max-width:639px)");
  const [message, setMessage] = useState(() => defaultMessage(hotel));
  const [notice, setNotice] = useState(null); // { text, tone: "ok" | "warn" }
  const [copied, setCopied] = useState(false);
  const urlInputRef = useRef(null);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  // "¡Copiado!" vuelve a "Copiar enlace" a los 2 s.
  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const handleClose = () => {
    setNotice(null);
    setCopied(false);
    onClose();
  };

  const image = hotel?.imageUrls?.filter(Boolean)?.[0];
  const imageSrc = image ? Environment.API_URL_IMG + image : "/hotel-placeholder.svg";
  const city = hotel?.city?.citName;
  const text = message.trim() || defaultMessage(hotel);

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  };

  const openNetwork = (network) => {
    window.open(network.href(url, text), "_blank", "noopener,noreferrer");
  };

  // Instagram no tiene URL para compartir desde la web: se copia el mensaje y se abre Instagram.
  const shareInstagram = async () => {
    const ok = await copyText(`${text} ${url}`);
    setNotice(
      ok
        ? { text: "Mensaje copiado: pégalo en tu historia o mensaje de Instagram.", tone: "ok" }
        : { text: "No se pudo copiar. Copia el enlace de abajo y pégalo en Instagram.", tone: "warn" }
    );
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const shareNative = async () => {
    try {
      await navigator.share({ title: hotel?.name, text, url });
    } catch {
      // El usuario canceló el menú del sistema: no es un error.
    }
  };

  const copyLink = async () => {
    const ok = await copyText(url);
    if (ok) {
      setCopied(true);
      setNotice(null);
    } else {
      urlInputRef.current?.select();
      setNotice({ text: "Copia el enlace manualmente (Ctrl+C).", tone: "warn" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      aria-labelledby="share-modal-title"
      slotProps={{ paper: { className: styles.paper } }}
    >
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 id="share-modal-title" className={styles.title}>Compartir alojamiento</h2>
          <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        {/* Vista previa del producto */}
        <article className={styles.preview}>
          <img
            src={imageSrc}
            alt={hotel?.name ?? "Alojamiento"}
            className={styles.previewImg}
            onError={(e) => { e.currentTarget.src = "/hotel-placeholder.svg"; }}
          />
          <div className={styles.previewBody}>
            <h3 className={styles.previewName}>{hotel?.name}</h3>
            {city && (
              <p className={styles.previewCity}>
                <MapPin size={13} aria-hidden="true" /> {city}
              </p>
            )}
            {hotel?.description && (
              <p className={styles.previewDesc}>{truncate(hotel.description)}</p>
            )}
          </div>
        </article>

        {/* Mensaje personalizado */}
        <label className={styles.label} htmlFor="share-message">Tu mensaje</label>
        <textarea
          id="share-message"
          className={styles.textarea}
          rows={3}
          maxLength={MAX_MESSAGE}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <p className={styles.counter}>{message.length}/{MAX_MESSAGE}</p>

        {/* Redes */}
        <p className={styles.label}>Compartir en</p>
        <div className={styles.networks}>
          {NETWORKS.map((n) => (
            <button
              key={n.key}
              type="button"
              className={`${styles.networkBtn} ${styles[n.key]}`}
              onClick={() => openNetwork(n)}
            >
              <n.Icon fontSize="small" aria-hidden="true" />
              <span>{n.label}</span>
            </button>
          ))}
          <button
            type="button"
            className={`${styles.networkBtn} ${styles.instagram}`}
            onClick={shareInstagram}
          >
            <InstagramIcon fontSize="small" aria-hidden="true" />
            <span>Instagram</span>
          </button>
          {canNativeShare && (
            <button type="button" className={styles.networkBtn} onClick={shareNative}>
              <Share2 size={18} aria-hidden="true" />
              <span>Más opciones</span>
            </button>
          )}
        </div>
        <p className={styles.hint}>En Facebook se comparte solo el enlace.</p>

        {/* Enlace */}
        <p className={styles.label}>Enlace</p>
        <div className={styles.linkRow}>
          <input
            ref={urlInputRef}
            className={styles.linkInput}
            value={url}
            readOnly
            onFocus={(e) => e.target.select()}
            aria-label="Enlace al alojamiento"
          />
          <button
            type="button"
            className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ""}`}
            onClick={copyLink}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "¡Copiado!" : "Copiar enlace"}</span>
          </button>
        </div>

        {notice && (
          <p className={`${styles.notice} ${notice.tone === "warn" ? styles.noticeWarn : ""}`} role="status">
            {notice.text}
          </p>
        )}
      </div>
    </Dialog>
  );
};
