import type { Coin } from "../../domain/market/coin.ts";
import {
  joinWithMarket,
  type WatchlistCoin,
  type WatchlistEntry,
} from "../../domain/watchlist/entries.ts";
import { change24hSeries, type Change24hBar } from "../../domain/watchlist-screen/chart.ts";
import { sortCoins, type SortState } from "../../domain/watchlist-screen/sort.ts";
import {
  filterBySearch,
  hiddenEntryCount,
  splitByFavorite,
} from "../../domain/watchlist-screen/view.ts";

export interface WatchlistView {
  /** Entradas cruzadas con el mercado, sin filtrar ni ordenar. */
  coins: WatchlistCoin[];
  /** Tras buscar y ordenar: lo que se ve, favoritas y resto mezcladas. */
  sortedItems: WatchlistCoin[];
  favorites: WatchlistCoin[];
  others: WatchlistCoin[];
  /** Entradas guardadas que no se ven por no estar en el top cargado. */
  hiddenCount: number;
  /** Barras de cambio 24 h de lo que se ve, en el mismo orden que `sortedItems`. */
  chartSeries: Change24hBar[];
}

/**
 * Lo que la pantalla enseña a partir de lo ya cargado: cruza, busca, ordena y
 * reparte. Mismo recorrido que `useWatchlistView` + `useWatchlistSorting`.
 */
// Conservado: el orden se aplica a las dos secciones a la vez, aunque los
// botones Precio y Cambio solo estuvieran en «Todas» (inventario §9, punto 27).
export function buildWatchlistView(
  entries: WatchlistEntry[],
  market: Coin[] | undefined,
  searchTerm: string,
  sort: SortState,
): WatchlistView {
  const coins = joinWithMarket(entries, market);
  const sortedItems = sortCoins(filterBySearch(coins, searchTerm), sort);
  const { favorites, others } = splitByFavorite(sortedItems);
  return {
    coins,
    sortedItems,
    favorites,
    others,
    hiddenCount: hiddenEntryCount(entries.length, coins.length, market !== undefined),
    chartSeries: change24hSeries(sortedItems),
  };
}
