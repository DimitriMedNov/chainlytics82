import type { Coin, CoinSearchResult, GlobalMarket, PricePoint } from "../../domain/market/coin.ts";
import type { FiatRate } from "../../domain/market/fiat.ts";
import { SEARCH_MAX_RESULTS, SEARCH_MIN_CHARS } from "../../domain/market/search.ts";
import type { MarketDataPort } from "./ports.ts";

/**
 * CoinGecko limita las peticiones anónimas, así que toda la app comparte
 * la MISMA consulta de mercados: siempre el top 100.
 */
export const MARKETS_SIZE = 100;
// Límites de la búsqueda: definidos en dominio; se reexporta el mínimo de
// letras para los hooks que deciden cuándo lanzar la consulta.
export { SEARCH_MIN_CHARS };

export interface MarketUseCases {
  listMarkets(signal?: AbortSignal): Promise<Coin[]>;
  getGlobalMarket(signal?: AbortSignal): Promise<GlobalMarket>;
  getPriceHistory(coinId: string, days: number, signal?: AbortSignal): Promise<PricePoint[]>;
  getFiatRates(signal?: AbortSignal): Promise<FiatRate[]>;
  searchCoins(query: string, signal?: AbortSignal): Promise<CoinSearchResult[]>;
  getCoinsByIds(ids: string[], signal?: AbortSignal): Promise<Coin[]>;
}

/** Casos de uso de datos de mercado. Reciben el puerto; no conocen CoinGecko. */
export function createMarketUseCases(market: MarketDataPort): MarketUseCases {
  return {
    listMarkets: (signal) => market.getMarkets(MARKETS_SIZE, signal),
    getGlobalMarket: (signal) => market.getGlobalMarket(signal),
    getPriceHistory: (coinId, days, signal) => market.getPriceHistory(coinId, days, signal),
    getFiatRates: (signal) => market.getFiatRates(signal),

    async searchCoins(query, signal) {
      const term = query.trim();
      if (term === "") return [];
      return market.searchCoins(term, SEARCH_MAX_RESULTS, signal);
    },

    async getCoinsByIds(ids, signal) {
      if (ids.length === 0) return [];
      return market.getCoinsByIds(ids, signal);
    },
  };
}
