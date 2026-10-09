import type { SearchStatus } from "../../domain/search/rules.ts";

/** Textos del buscador global, tal cual estaban en la interfaz anterior. */
export const SEARCH_TRIGGER_LABEL = "Buscar moneda";
export const SEARCH_TRIGGER_ARIA_LABEL = "Buscar criptomoneda";
export const SEARCH_PLACEHOLDER = "Busca cualquier criptomoneda…";
export const SEARCH_RESULTS_HEADING = "Resultados";
export const SEARCH_TOO_SHORT = "Escribe al menos dos letras.";
export const SEARCH_SEARCHING = "Buscando…";
export const SEARCH_EMPTY = "Ninguna moneda con ese nombre.";
export const COIN_LOAD_ERROR_TITLE = "No se pudo cargar esa moneda";
/** Nuevos: botón del estado `error` (`refetch()`) y su texto mientras `isFetching`. */
export const SEARCH_RETRY = "Reintentar";
export const SEARCH_RETRYING = "Reintentando…";
/** Nuevo: espera mientras se carga la moneda elegida (`detail.isLoading`). */
export const COIN_LOADING = "Cargando la moneda…";
/** Nuevos de la paleta: cerrar, vaciar la caja y las pistas de teclado del pie. */
export const SEARCH_CLOSE_LABEL = "Cerrar el buscador";
export const SEARCH_CLEAR = "Borrar búsqueda";
export const SEARCH_HINT_NAVIGATE = "Navegar";
export const SEARCH_HINT_OPEN = "Abrir";
export const SEARCH_HINT_CLOSE = "Cerrar";

/**
 * El texto de cada estado sin resultados. En `error` es el mensaje del fallo
 * (ya viene en español de la capa de datos). En `results` no hay texto.
 */
export function searchStatusMessage(status: SearchStatus, errorMessage: string): string {
  switch (status) {
    case "too-short":
      return SEARCH_TOO_SHORT;
    case "searching":
      return SEARCH_SEARCHING;
    case "error":
      return errorMessage;
    case "empty":
      return SEARCH_EMPTY;
    case "results":
      return "";
  }
}

/** Posición en el ranking como «#12», o null si la moneda no tiene. */
export function rankLabel(rank: number | null): string | null {
  return rank === null ? null : `#${rank}`;
}

/** Aviso cuando no se puede cargar la moneda elegida. */
export interface CoinLoadErrorNotice {
  title: string;
  description: string;
}

export function coinLoadErrorNotice(errorMessage: string): CoinLoadErrorNotice {
  return { title: COIN_LOAD_ERROR_TITLE, description: errorMessage };
}
