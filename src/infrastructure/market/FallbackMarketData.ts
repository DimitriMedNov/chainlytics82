import type { MarketDataPort } from "../../application/market/ports.ts";

/** Una petición que canceló quien la pidió no es un fallo del proveedor. */
function isCancelled(error: unknown, signal: AbortSignal | undefined): boolean {
  if (signal?.aborted) return true;
  return error instanceof Error && error.name === "AbortError";
}

/**
 * Proveedor de precios con respaldo (Decorator sobre `MarketDataPort`): cada
 * petición va primero a `primary` y, solo si falla, se repite contra
 * `fallback`. Si fallan los dos se lanza el error del principal, que es el
 * que explica qué le pasa al servicio habitual.
 */
export function createFallbackMarketData(
  primary: MarketDataPort,
  fallback: MarketDataPort,
): MarketDataPort {
  async function attempt<T>(
    signal: AbortSignal | undefined,
    call: (port: MarketDataPort) => Promise<T>,
  ): Promise<T> {
    try {
      return await call(primary);
    } catch (primaryError) {
      if (isCancelled(primaryError, signal)) throw primaryError;
      try {
        return await call(fallback);
      } catch (fallbackError) {
        if (isCancelled(fallbackError, signal)) throw fallbackError;
        throw primaryError;
      }
    }
  }

  return {
    getMarkets: (perPage, signal) => attempt(signal, (port) => port.getMarkets(perPage, signal)),
    getGlobalMarket: (signal) => attempt(signal, (port) => port.getGlobalMarket(signal)),
    getPriceHistory: (coinId, days, signal) =>
      attempt(signal, (port) => port.getPriceHistory(coinId, days, signal)),
    getFiatRates: (signal) => attempt(signal, (port) => port.getFiatRates(signal)),
    searchCoins: (term, limit, signal) =>
      attempt(signal, (port) => port.searchCoins(term, limit, signal)),
    getCoinsByIds: (ids, signal) => attempt(signal, (port) => port.getCoinsByIds(ids, signal)),
  };
}
