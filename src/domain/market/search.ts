/**
 * Límites de la búsqueda de monedas. Única fuente: los usan el caso de uso de
 * búsqueda (`application/market`) y las reglas de la paleta (`domain/search`).
 */

/** Letras mínimas (sin contar espacios de los extremos) para lanzar una búsqueda. */
export const SEARCH_MIN_CHARS = 2;
/** Resultados que se piden y se enseñan como mucho. */
export const SEARCH_MAX_RESULTS = 12;
