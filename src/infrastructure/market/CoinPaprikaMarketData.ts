import type { MarketDataPort } from "../../application/market/ports.ts";
import { ApiError } from "../../application/shared/errors.ts";
import type { Coin } from "../../domain/market/coin.ts";
import { FIAT } from "../../domain/market/fiat.ts";
import { isHourlyRange } from "../../domain/shared/range.ts";
import { knownPaprikaId, toGeckoId } from "./coinPaprikaIds.ts";
import {
  toCoin,
  toCoins,
  toFiatRates,
  toGlobalMarket,
  toPricePoints,
  toSearchResults,
} from "./coinPaprikaMappers.ts";
import { str } from "./dto.ts";
import type { GetJson } from "./httpJson.ts";

/** Monedas que se cargan para saber qué id de CoinPaprika tiene cada una. */
const TOP_SIZE = 250;
/** El plan gratis da horas solo de las últimas 24 h y días solo del último año. */
const HOURLY_WINDOW_S = 23 * 3600;
const MAX_DAILY_DAYS = 364;
/** El plan gratis admite 3 cotizaciones por petición: el dólar y dos más. */
const FIAT_PER_REQUEST = 2;

const byRank = (a: Coin, b: Coin) => (a.rank || Infinity) - (b.rank || Infinity);

/**
 * Datos de mercado desde CoinPaprika (plan gratis, sin clave). Recibe y
 * devuelve siempre ids de CoinGecko; la traducción no sale de aquí.
 * `getJson` es el cliente GET ya apuntado a la API (`createGetJson(baseUrl)`).
 */
export function createCoinPaprikaMarketData(
  getJson: GetJson,
  now: () => number = Date.now,
): MarketDataPort {
  const paprikaIdByGecko = new Map<string, string>();

  function remember(rows: unknown): void {
    if (!Array.isArray(rows)) return;
    for (const row of rows as Array<Record<string, unknown>>) {
      const paprikaId = str(row?.id);
      const geckoId = toGeckoId(paprikaId, str(row?.symbol));
      if (paprikaId !== "" && !paprikaIdByGecko.has(geckoId)) paprikaIdByGecko.set(geckoId, paprikaId);
    }
  }

  async function loadTop(size: number, signal?: AbortSignal): Promise<Coin[]> {
    const data = await getJson(`/tickers?limit=${size}`, signal);
    remember(data);
    return toCoins(data).sort(byRank);
  }

  /** Id de CoinPaprika de una moneda: lo ya visto, la tabla, el top y, al final, la búsqueda. */
  async function resolve(geckoId: string, signal?: AbortSignal): Promise<string | undefined> {
    const known = paprikaIdByGecko.get(geckoId) ?? knownPaprikaId(geckoId);
    if (known) return known;
    if (paprikaIdByGecko.size < TOP_SIZE) await loadTop(TOP_SIZE, signal);
    if (!paprikaIdByGecko.has(geckoId)) {
      const term = encodeURIComponent(geckoId.replace(/-/g, " "));
      const found = await getJson(`/search/?q=${term}&c=currencies&limit=10`, signal);
      remember((found as { currencies?: unknown })?.currencies);
    }
    return paprikaIdByGecko.get(geckoId);
  }

  return {
    getMarkets: (perPage, signal) => loadTop(perPage, signal),

    async getGlobalMarket(signal) {
      return toGlobalMarket(await getJson("/global", signal));
    },

    async getPriceHistory(coinId, days, signal) {
      const paprikaId = await resolve(coinId, signal);
      if (!paprikaId) throw new ApiError(404, "El servicio de respaldo no conoce esta moneda.");
      const nowS = Math.floor(now() / 1000);
      const query = isHourlyRange(days)
        ? `start=${nowS - HOURLY_WINDOW_S}&interval=1h`
        : `start=${nowS - Math.min(days, MAX_DAILY_DAYS) * 86_400}&interval=1d`;
      return toPricePoints(await getJson(`/tickers/${paprikaId}/historical?${query}`, signal));
    },

    async getFiatRates(signal) {
      const codes = FIAT.map((fiat) => fiat.code).filter((code) => code !== "USD");
      const requests: Array<Promise<unknown>> = [];
      for (let i = 0; i < codes.length; i += FIAT_PER_REQUEST) {
        const quotes = ["USD", ...codes.slice(i, i + FIAT_PER_REQUEST)].join(",");
        requests.push(getJson(`/tickers/btc-bitcoin?quotes=${quotes}`, signal));
      }
      return toFiatRates(await Promise.all(requests));
    },

    async searchCoins(term, limit, signal) {
      const payload = await getJson(
        `/search/?q=${encodeURIComponent(term)}&c=currencies&limit=${limit}`,
        signal,
      );
      remember((payload as { currencies?: unknown })?.currencies);
      return toSearchResults(payload, limit);
    },

    /** El top llega en una petición; las que no están en él se piden una a una. */
    async getCoinsByIds(ids, signal) {
      const top = new Map((await loadTop(TOP_SIZE, signal)).map((coin) => [coin.id, coin]));
      const coins = await Promise.all(
        ids.map(async (id): Promise<Coin | null> => {
          const inTop = top.get(id);
          if (inTop) return inTop;
          const paprikaId = await resolve(id, signal);
          if (!paprikaId) return null;
          try {
            return { ...toCoin(await getJson(`/tickers/${paprikaId}`, signal)), id };
          } catch (error) {
            if (error instanceof ApiError && error.status === 404) return null;
            throw error;
          }
        }),
      );
      return coins.filter((coin): coin is Coin => coin !== null).sort(byRank);
    },
  };
}
