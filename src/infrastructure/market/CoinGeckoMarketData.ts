import type { MarketDataPort } from "@/application/market/ports";
import { isHourlyRange } from "@/domain/shared/range";
import { createGetJson } from "./httpJson";
import { toCoins, toFiatRates, toGlobalMarket, toPricePoints, toSearchResults } from "./mappers";

/**
 * Datos de mercado desde CoinGecko. `baseUrl` se puede apuntar a un proxy
 * propio o al dominio de pago (`https://pro-api.coingecko.com/api/v3`).
 */
export function createCoinGeckoMarketData(baseUrl: string): MarketDataPort {
  const getJson = createGetJson(baseUrl);

  return {
    async getMarkets(perPage, signal) {
      const data = await getJson(
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}` +
          `&page=1&sparkline=false&price_change_percentage=24h,7d`,
        signal,
      );
      return toCoins(data);
    },

    async getGlobalMarket(signal) {
      return toGlobalMarket(await getJson("/global", signal));
    },

    /** Por debajo de dos días pedimos la serie fina: la API no acepta `interval=daily` ahí. */
    async getPriceHistory(coinId, days, signal) {
      const intervalo = isHourlyRange(days) ? "" : "&interval=daily";
      const payload = await getJson(
        `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}${intervalo}`,
        signal,
      );
      return toPricePoints(payload);
    },

    async getFiatRates(signal) {
      return toFiatRates(await getJson("/exchange_rates", signal));
    },

    async searchCoins(term, limit, signal) {
      const payload = await getJson(`/search?query=${encodeURIComponent(term)}`, signal);
      return toSearchResults(payload, limit);
    },

    async getCoinsByIds(ids, signal) {
      const data = await getJson(
        `/coins/markets?vs_currency=usd&ids=${encodeURIComponent(ids.join(","))}` +
          `&sparkline=false&price_change_percentage=24h,7d`,
        signal,
      );
      return toCoins(data);
    },
  };
}
