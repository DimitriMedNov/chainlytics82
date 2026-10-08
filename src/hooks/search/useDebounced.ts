import { useEffect, useState } from "react";

/** Retardo de la búsqueda: el mismo que tenía la interfaz anterior. */
export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Retrasa un valor. Se usa para no lanzar una búsqueda por cada tecla
 * pulsada, que agotaría el límite de peticiones de la API.
 */
export function useDebounced<T>(value: T, delayMs = SEARCH_DEBOUNCE_MS): T {
  const [delayed, setDelayed] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDelayed(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return delayed;
}
