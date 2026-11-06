import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  addFavorite,
  getFavoriteIds,
  removeFavorite,
} from "../services/favoriteServices/favoriteService";

const FavoritesContext = createContext(null);
const EMPTY = new Set();

/**
 * Ids de hoteles favoritos del usuario logueado.
 * Se cargan una vez por sesión; los ids quedan atados al `user` que los pidió,
 * así que al cerrar sesión (o cambiar de usuario) se vacían solos.
 */
export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState({ owner: null, ids: EMPTY });

  useEffect(() => {
    if (!user) return undefined;
    let cancelled = false;
    getFavoriteIds()
      .then((list) => {
        if (!cancelled) {
          setLoaded({ owner: user, ids: new Set((Array.isArray(list) ? list : []).map(Number)) });
        }
      })
      .catch((err) => console.error("No se pudieron cargar los favoritos:", err));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const ready = Boolean(user) && loaded.owner === user;
  const ids = ready ? loaded.ids : EMPTY;

  const isFavorite = useCallback((hotSec) => ids.has(Number(hotSec)), [ids]);

  // Cambia el corazón al instante y lo revierte si el backend falla.
  const toggleFavorite = useCallback(
    async (hotSec) => {
      const id = Number(hotSec);
      const wasFavorite = ids.has(id);
      const apply = (fav) =>
        setLoaded((prev) => {
          const next = new Set(prev.ids);
          if (fav) next.add(id);
          else next.delete(id);
          return { owner: prev.owner, ids: next };
        });

      apply(!wasFavorite);
      try {
        if (wasFavorite) await removeFavorite(id);
        else await addFavorite(id);
      } catch (err) {
        apply(wasFavorite);
        throw err;
      }
    },
    [ids]
  );

  const value = useMemo(
    () => ({ ready, isFavorite, toggleFavorite }),
    [ready, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => useContext(FavoritesContext);
