import type { Coin } from "../market/coin.ts";

/** Qué monedas enseña el listado de mercados según su cambio en 24 h. */
export type MarketFilter = "all" | "gainers" | "losers";

/** Orden en el que se ofrecen los filtros en el desplegable "Mostrar". */
export const MARKET_FILTER_VALUES: readonly MarketFilter[] = ["all", "gainers", "losers"];

export const DEFAULT_MARKET_FILTER: MarketFilter = "all";

/**
 * Un predicado por filtro (Strategy): añadir un filtro es añadir una entrada.
 *
 * Conservado: "gainers" excluye el cambio exactamente 0 (`> 0`), mientras la
 * fila pinta el 0 como subida (`isRising`, `>= 0`). Inventario §9 nº 30.
 */
export const MARKET_FILTER_PREDICATES: Readonly<Record<MarketFilter, (coin: Coin) => boolean>> = {
  all: () => true,
  gainers: (coin) => coin.change24h > 0,
  losers: (coin) => coin.change24h < 0,
};

export function isMarketFilter(value: string): value is MarketFilter {
  return (MARKET_FILTER_VALUES as readonly string[]).includes(value);
}

/** Texto de búsqueda tal como se compara: sin espacios alrededor y en minúsculas. */
export function normalizeSearchTerm(searchTerm: string): string {
  return searchTerm.trim().toLowerCase();
}

/** Coincide por nombre o por símbolo, sin distinguir mayúsculas. Vacío = todas. */
export function matchesSearch(coin: Coin, needle: string): boolean {
  return (
    needle === "" ||
    coin.name.toLowerCase().includes(needle) ||
    coin.symbol.toLowerCase().includes(needle)
  );
}

/** Búsqueda y filtro a la vez, respetando el orden de entrada. */
export function filterCoins(coins: Coin[], searchTerm: string, filter: MarketFilter): Coin[] {
  const needle = normalizeSearchTerm(searchTerm);
  const matchesFilter = MARKET_FILTER_PREDICATES[filter];
  return coins.filter((coin) => matchesSearch(coin, needle) && matchesFilter(coin));
}

/**
 * Regla de signo de la fila: decide icono y color del cambio en 24 h.
 * Conservado: el 0 exacto cuenta como subida. Inventario §9 nº 30.
 */
export function isRising(coin: Pick<Coin, "change24h">): boolean {
  return coin.change24h >= 0;
}
