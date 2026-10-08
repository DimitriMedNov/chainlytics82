import type { Coin, CoinSearchResult, GlobalMarket, PricePoint } from "../../domain/market/coin.ts";
import type { FiatRate } from "../../domain/market/fiat.ts";

/**
 * Única puerta a los datos de mercado (Facade): esconde los seis endpoints
 * del proveedor de precios detrás de una interfaz propia y pequeña.
 *
 * Los métodos lanzan `ApiError` con el mensaje en español; la señal permite
 * cancelar la petición.
 */
export interface MarketDataPort {
  /** Top de monedas por capitalización de mercado. */
  getMarkets(perPage: number, signal?: AbortSignal): Promise<Coin[]>;
  /** Cifras globales: capitalización total, volumen y dominancia de BTC. */
  getGlobalMarket(signal?: AbortSignal): Promise<GlobalMarket>;
  getPriceHistory(coinId: string, days: number, signal?: AbortSignal): Promise<PricePoint[]>;
  /** Cuántos dólares vale una unidad de cada moneda fiat del catálogo. */
  getFiatRates(signal?: AbortSignal): Promise<FiatRate[]>;
  /** Busca entre TODAS las monedas del catálogo, no solo el top. */
  searchCoins(term: string, limit: number, signal?: AbortSignal): Promise<CoinSearchResult[]>;
  /** Datos de mercado de monedas concretas, estén o no en el top. */
  getCoinsByIds(ids: string[], signal?: AbortSignal): Promise<Coin[]>;
}
