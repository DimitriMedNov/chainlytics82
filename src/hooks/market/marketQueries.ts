import { queryOptions } from "@tanstack/react-query";
import {
  MARKETS_SIZE,
  SEARCH_MIN_CHARS,
  type MarketUseCases,
} from "@/application/market/useCases";

const UN_MINUTO = 60_000;

/**
 * Opciones de react-query de cada consulta de mercado: clave, caducidad y
 * refresco. Están aquí, y no dentro de cada hook, para que quien necesite la
 * misma consulta de otra forma (por ejemplo varias a la vez con `useQueries`)
 * comparta clave y caché en vez de duplicarla.
 */
export const marketQueries = {
  /** Top 100. Toda la app comparte esta consulta. */
  markets: (market: MarketUseCases) =>
    queryOptions({
      queryKey: ["markets", MARKETS_SIZE],
      queryFn: ({ signal }) => market.listMarkets(signal),
      staleTime: UN_MINUTO,
      refetchInterval: UN_MINUTO,
    }),

  globalMarket: (market: MarketUseCases) =>
    queryOptions({
      queryKey: ["global-market"],
      queryFn: ({ signal }) => market.getGlobalMarket(signal),
      staleTime: UN_MINUTO,
      refetchInterval: UN_MINUTO * 5,
    }),

  priceHistory: (
    market: MarketUseCases,
    coinId: string | undefined,
    days: number,
    enabled = true,
  ) =>
    queryOptions({
      queryKey: ["price-history", coinId, days],
      queryFn: ({ signal }) => market.getPriceHistory(coinId as string, days, signal),
      enabled: Boolean(coinId) && enabled,
      staleTime: UN_MINUTO * 5,
    }),

  fiatRates: (market: MarketUseCases) =>
    queryOptions({
      queryKey: ["fiat-rates"],
      queryFn: ({ signal }) => market.getFiatRates(signal),
      staleTime: UN_MINUTO * 10,
    }),

  coinSearch: (market: MarketUseCases, query: string) =>
    queryOptions({
      queryKey: ["coin-search", query],
      queryFn: ({ signal }) => market.searchCoins(query, signal),
      enabled: query.trim().length >= SEARCH_MIN_CHARS,
      staleTime: UN_MINUTO * 10,
    }),

  /** `sortedIds` tiene que venir ya ordenado: forma parte de la clave. */
  coinsByIds: (market: MarketUseCases, sortedIds: string[]) =>
    queryOptions({
      queryKey: ["coins-by-id", sortedIds],
      queryFn: ({ signal }) => market.getCoinsByIds(sortedIds, signal),
      enabled: sortedIds.length > 0,
      staleTime: UN_MINUTO,
      refetchInterval: UN_MINUTO,
    }),
};
