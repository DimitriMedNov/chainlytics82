import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  fetchCoinsByIds,
  fetchFiatRates,
  fetchGlobalMarket,
  fetchMarkets,
  fetchPriceHistory,
  searchCoins,
  type CoinSearchResult,
} from "@/lib/coingecko";
import type { Coin, FiatRate, GlobalMarket, PricePoint } from "@/types/coin";

/**
 * CoinGecko limita las peticiones anónimas, así que toda la app comparte
 * la MISMA consulta de mercados. React Query la reutiliza entre pantallas
 * en vez de pedirla otra vez en cada una.
 */
const MARKETS_SIZE = 100;
const UN_MINUTO = 60_000;

export function useMarkets(): UseQueryResult<Coin[], Error> {
  return useQuery({
    queryKey: ["markets", MARKETS_SIZE],
    queryFn: ({ signal }) => fetchMarkets(MARKETS_SIZE, signal),
    staleTime: UN_MINUTO,
    refetchInterval: UN_MINUTO,
  });
}

/** Busca una moneda concreta dentro del top que ya tenemos cargado. */
export function findCoin(coins: Coin[] | undefined, idOrSymbol: string): Coin | undefined {
  if (!coins) return undefined;
  const needle = idOrSymbol.toLowerCase();
  return coins.find((coin) => coin.id === needle || coin.symbol.toLowerCase() === needle);
}

export function useGlobalMarket(): UseQueryResult<GlobalMarket, Error> {
  return useQuery({
    queryKey: ["global-market"],
    queryFn: ({ signal }) => fetchGlobalMarket(signal),
    staleTime: UN_MINUTO,
    refetchInterval: UN_MINUTO * 5,
  });
}

export function usePriceHistory(
  coinId: string | undefined,
  days: number,
  enabled = true,
): UseQueryResult<PricePoint[], Error> {
  return useQuery({
    queryKey: ["price-history", coinId, days],
    queryFn: ({ signal }) => fetchPriceHistory(coinId as string, days, signal),
    enabled: Boolean(coinId) && enabled,
    staleTime: UN_MINUTO * 5,
  });
}

export function useFiatRates(): UseQueryResult<FiatRate[], Error> {
  return useQuery({
    queryKey: ["fiat-rates"],
    queryFn: ({ signal }) => fetchFiatRates(signal),
    staleTime: UN_MINUTO * 10,
  });
}

/**
 * Busca en todo el catálogo. `enabled` evita disparar una petición por cada
 * tecla: la pantalla de búsqueda pasa el término ya retrasado.
 */
export function useCoinSearch(query: string): UseQueryResult<CoinSearchResult[], Error> {
  return useQuery({
    queryKey: ["coin-search", query],
    queryFn: ({ signal }) => searchCoins(query, 12, signal),
    enabled: query.trim().length >= 2,
    staleTime: UN_MINUTO * 10,
  });
}

/** Datos de mercado de monedas sueltas, aunque estén fuera del top cargado. */
export function useCoinsByIds(ids: string[]): UseQueryResult<Coin[], Error> {
  const clave = [...ids].sort();
  return useQuery({
    queryKey: ["coins-by-id", clave],
    queryFn: ({ signal }) => fetchCoinsByIds(clave, signal),
    enabled: clave.length > 0,
    staleTime: UN_MINUTO,
    refetchInterval: UN_MINUTO,
  });
}
