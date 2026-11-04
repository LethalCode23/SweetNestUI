import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getSearchSuggestions } from "../../../services/hotelServices/hotelService";

export const MIN_CHARS = 2;
export const DEBOUNCE_MS = 300;

const isCancel = (err) => axios.isCancel(err) || err?.code === "ERR_CANCELED" || err?.name === "CanceledError";

/**
 * Sugerencias del buscador (GET /api/hotel/suggestions?q=).
 *
 * - No consulta con menos de MIN_CHARS caracteres (estado "idle").
 * - Espera DEBOUNCE_MS desde la última tecla antes de pedir.
 * - Cancela la petición en curso (AbortController) cuando cambia el texto o se desmonta.
 * - Descarta respuestas que no correspondan a la última búsqueda (contador de petición).
 *
 * Devuelve { status: "idle" | "loading" | "success" | "error", items, query, retry }.
 * `items` conserva los últimos resultados mientras carga, para que la lista no parpadee.
 */
export const useSearchSuggestions = (rawQuery) => {
  const query = rawQuery.trim();
  const enabled = query.length >= MIN_CHARS;

  // Resultado de la última búsqueda resuelta (para qué texto, qué devolvió, si falló)
  const [result, setResult] = useState({ query: "", items: [], error: false });
  const [pendingQuery, setPendingQuery] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;

    const controller = new AbortController();
    const id = ++requestId.current;

    const timer = setTimeout(async () => {
      setPendingQuery(query);
      try {
        const items = await getSearchSuggestions(query, { signal: controller.signal });
        if (id === requestId.current) setResult({ query, items, error: false });
      } catch (err) {
        if (isCancel(err) || id !== requestId.current) return;
        setResult({ query, items: [], error: true });
      } finally {
        if (id === requestId.current) setPendingQuery(null);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, enabled, attempt]);

  // Estado derivado: nada de setState síncrono en el efecto
  let status = "idle";
  if (enabled) {
    if (result.query === query && pendingQuery === null) status = result.error ? "error" : "success";
    else status = "loading";
  }

  return {
    status,
    query,
    items: enabled ? result.items : [],
    retry: () => setAttempt((n) => n + 1),
  };
};

export default useSearchSuggestions;
