import { findCoin, type Coin, type CoinSearchResult } from "../market/coin.ts";
import { SEARCH_MAX_RESULTS, SEARCH_MIN_CHARS } from "../market/search.ts";

// Los dos límites viven en `domain/market/search.ts`; se reexportan aquí para
// quien ya los importaba de las reglas de la paleta.
export { SEARCH_MAX_RESULTS, SEARCH_MIN_CHARS };

/** true mientras el texto es demasiado corto para buscar. */
export function isQueryTooShort(query: string): boolean {
  return query.trim().length < SEARCH_MIN_CHARS;
}

/** Nunca más de `SEARCH_MAX_RESULTS`, en el orden en que llegan. */
export function limitResults(results: readonly CoinSearchResult[]): CoinSearchResult[] {
  return results.slice(0, SEARCH_MAX_RESULTS);
}

/**
 * Qué enseña la paleta:
 * - `results`: hay resultados (aunque se esté recargando por detrás).
 * - `too-short`: aún no hay dos letras.
 * - `searching`: petición en curso y nada que enseñar todavía.
 * - `error`: la búsqueda falló.
 * - `empty`: la búsqueda terminó sin coincidencias.
 */
export type SearchStatus = "results" | "too-short" | "searching" | "error" | "empty";

export interface SearchSnapshot {
  /** El texto ya retrasado, que es con el que se busca. */
  query: string;
  resultCount: number;
  isFetching: boolean;
  isError: boolean;
}

/** Mismo orden de prioridad que `CoinSearchDialog.tsx:31-39` de la interfaz anterior. */
export function resolveSearchStatus(snapshot: SearchSnapshot): SearchStatus {
  if (snapshot.resultCount > 0) return "results";
  if (isQueryTooShort(snapshot.query)) return "too-short";
  if (snapshot.isFetching) return "searching";
  if (snapshot.isError) return "error";
  return "empty";
}

/**
 * La moneda elegida, si ya está en el top cargado.
 *
 * Conservado: usa `findCoin`, que compara el id elegido con el id **o el
 * símbolo** de las monedas del top (`GlobalSearch.tsx:21`). Un resultado cuyo
 * id coincida con el símbolo de otra moneda del top abriría esa otra.
 */
export function findLoadedCoin(
  markets: Coin[] | undefined,
  selectedId: string | null,
): Coin | undefined {
  return selectedId === null ? undefined : findCoin(markets, selectedId);
}

/** Regla "si ya está en el top 100, no la pidas otra vez": ids que faltan por pedir. */
export function idsToFetch(markets: Coin[] | undefined, selectedId: string | null): string[] {
  if (selectedId === null || findLoadedCoin(markets, selectedId)) return [];
  return [selectedId];
}

/** La moneda lista para el detalle: la del top si está, si no la pedida por id. */
export function resolveSelectedCoin(
  markets: Coin[] | undefined,
  selectedId: string | null,
  fetched: Coin[] | undefined,
): Coin | null {
  return findLoadedCoin(markets, selectedId) ?? fetched?.[0] ?? null;
}
