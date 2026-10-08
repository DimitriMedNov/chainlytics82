import type { WatchlistCoin } from "../watchlist/entries.ts";

/** Filtra por nombre o símbolo, sin distinguir mayúsculas. Búsqueda vacía = todo. */
export function filterBySearch(coins: WatchlistCoin[], searchTerm: string): WatchlistCoin[] {
  const needle = searchTerm.trim().toLowerCase();
  if (needle === "") return coins;
  return coins.filter(
    (item) =>
      item.name.toLowerCase().includes(needle) || item.symbol.toLowerCase().includes(needle),
  );
}

export interface WatchlistSections {
  /** Las marcadas como favoritas. */
  favorites: WatchlistCoin[];
  /** El resto (la sección «Todas» solo lleva las NO favoritas). */
  others: WatchlistCoin[];
}

/** Reparte la lista en favoritas y resto, conservando el orden recibido. */
export function splitByFavorite(items: WatchlistCoin[]): WatchlistSections {
  return {
    favorites: items.filter((item) => item.isFavorite),
    others: items.filter((item) => !item.isFavorite),
  };
}

/**
 * Cuántas entradas guardadas no aparecen porque no están en el mercado cargado
 * (el top 100). Sin mercado cargado todavía no se sabe: 0.
 */
export function hiddenEntryCount(
  entryCount: number,
  coinCount: number,
  marketLoaded: boolean,
): number {
  return marketLoaded ? Math.max(0, entryCount - coinCount) : 0;
}
