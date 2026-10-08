import { useCallback } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  labelPricePoints,
  type LabeledPricePoint,
} from "@/application/market/presentation/pricePointLabels";
import { useDeps } from "@/app/deps";
import type { Coin, CoinSearchResult, GlobalMarket, PricePoint } from "@/domain/market/coin";
import type { FiatRate } from "@/domain/market/fiat";
import { marketQueries } from "@/hooks/market/marketQueries";

/**
 * CoinGecko limita las peticiones anónimas, así que toda la app comparte
 * la MISMA consulta de mercados. React Query la reutiliza entre pantallas
 * en vez de pedirla otra vez en cada una.
 */
export function useMarkets(): UseQueryResult<Coin[], Error> {
  const { market } = useDeps();
  return useQuery(marketQueries.markets(market));
}

export function useGlobalMarket(): UseQueryResult<GlobalMarket, Error> {
  const { market } = useDeps();
  return useQuery(marketQueries.globalMarket(market));
}

/**
 * Histórico de precios de una moneda, con las etiquetas de fecha del eje y
 * del tooltip ya puestas. En la caché se guardan los puntos sin etiquetar.
 */
export function usePriceHistory(
  coinId: string | undefined,
  days: number,
  enabled = true,
): UseQueryResult<LabeledPricePoint[], Error> {
  const { market } = useDeps();
  const select = useCallback((points: PricePoint[]) => labelPricePoints(points, days), [days]);
  return useQuery({ ...marketQueries.priceHistory(market, coinId, days, enabled), select });
}

export function useFiatRates(): UseQueryResult<FiatRate[], Error> {
  const { market } = useDeps();
  return useQuery(marketQueries.fiatRates(market));
}

/**
 * Busca en todo el catálogo. `enabled` evita disparar una petición por cada
 * tecla: la pantalla de búsqueda pasa el término ya retrasado.
 */
export function useCoinSearch(query: string): UseQueryResult<CoinSearchResult[], Error> {
  const { market } = useDeps();
  return useQuery(marketQueries.coinSearch(market, query));
}

/** Datos de mercado de monedas sueltas, aunque estén fuera del top cargado. */
export function useCoinsByIds(ids: string[]): UseQueryResult<Coin[], Error> {
  const { market } = useDeps();
  const clave = [...ids].sort();
  return useQuery(marketQueries.coinsByIds(market, clave));
}
