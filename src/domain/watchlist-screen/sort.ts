import type { WatchlistCoin } from "../watchlist/entries.ts";

export type SortField = "name" | "price" | "change";
export type SortOrder = "asc" | "desc";

/** Por qué clave y en qué sentido está ordenada la lista. */
export interface SortState {
  field: SortField;
  order: SortOrder;
}

/** Orden al entrar en la pantalla: nombre ascendente. */
export const DEFAULT_SORT: SortState = { field: "name", order: "asc" };

/** Al repetir clave se invierte el sentido; al cambiar de clave, ascendente. */
export function nextSort(current: SortState, field: SortField): SortState {
  if (current.field === field) {
    return { field, order: current.order === "asc" ? "desc" : "asc" };
  }
  return { field, order: "asc" };
}

export type CoinComparator = (a: WatchlistCoin, b: WatchlistCoin) => number;

/**
 * Strategy: un comparador (en sentido ascendente) por clave de orden.
 * Añadir una clave nueva es añadir una entrada aquí.
 */
export const SORT_COMPARATORS: Record<SortField, CoinComparator> = {
  name: (a, b) => a.name.localeCompare(b.name, "es"),
  price: (a, b) => a.price - b.price,
  change: (a, b) => a.change24h - b.change24h,
};

/** Devuelve una copia ordenada; no toca la lista recibida. */
export function sortCoins(items: WatchlistCoin[], sort: SortState): WatchlistCoin[] {
  const direction = sort.order === "asc" ? 1 : -1;
  const compare = SORT_COMPARATORS[sort.field];
  return [...items].sort((a, b) => compare(a, b) * direction);
}
