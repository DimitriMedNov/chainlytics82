import { useEffect, useState } from "react";

/**
 * Retrasa un valor. Se usa para no lanzar una búsqueda por cada tecla
 * pulsada, que agotaría el límite de peticiones de la API.
 */
export function useDebounced<T>(value: T, delayMs = 300): T {
  const [delayed, setDelayed] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDelayed(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return delayed;
}
