import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

/**
 * Estado del corazón de un hotel. Sin sesión manda a /login y vuelve a la página actual.
 * Uso: const { active, busy, toggle } = useFavoriteToggle(hotSec);  onClick={toggle}
 */
export const useFavoriteToggle = (hotSec) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);

  const toggle = async (e) => {
    e?.preventDefault();
    e?.stopPropagation(); // la card entera es clicable: no abrir el detalle
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      await toggleFavorite(hotSec);
    } catch (err) {
      console.error("No se pudo actualizar el favorito:", err);
    } finally {
      setBusy(false);
    }
  };

  return { active: Boolean(user) && isFavorite(hotSec), busy, toggle };
};
