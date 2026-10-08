import type { Coin } from "../market/coin.ts";

/** Por qué dato se ordena el listado de mercados. */
export type MarketSortKey = "marketcap" | "volume" | "change" | "price" | "rank";

/** Orden en el que se ofrecen en el desplegable "Ordenar por". */
export const MARKET_SORT_KEYS: readonly MarketSortKey[] = [
  "marketcap",
  "volume",
  "change",
  "price",
  "rank",
];

export const DEFAULT_MARKET_SORT: MarketSortKey = "marketcap";

export type CoinComparator = (a: Coin, b: Coin) => number;

/**
 * Un comparador por clave (Strategy). Todos de mayor a menor, salvo el
 * ranking, que va de menor a mayor (el nº 1 primero).
 */
export const MARKET_COMPARATORS: Readonly<Record<MarketSortKey, CoinComparator>> = {
  marketcap: (a, b) => b.marketCap - a.marketCap,
  volume: (a, b) => b.volume24h - a.volume24h,
  change: (a, b) => b.change24h - a.change24h,
  price: (a, b) => b.price - a.price,
  rank: (a, b) => a.rank - b.rank,
};

export function isMarketSortKey(value: string): value is MarketSortKey {
  return (MARKET_SORT_KEYS as readonly string[]).includes(value);
}

/** Devuelve una copia ordenada; no toca la lista recibida. */
export function sortCoins(coins: Coin[], key: MarketSortKey): Coin[] {
  return [...coins].sort(MARKET_COMPARATORS[key]);
}
