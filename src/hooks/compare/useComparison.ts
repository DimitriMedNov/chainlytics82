import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useDeps } from "@/app/deps";
import { compareCoins } from "@/application/compare/useCases";
import type { Comparison } from "@/domain/compare/series";
import type { Coin } from "@/domain/market/coin";
import { marketQueries } from "@/hooks/market/marketQueries";

export interface ComparisonState extends Comparison {
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  isFetching: boolean;
  refetch: () => void;
}

/**
 * Pide el histórico de cada moneda elegida y los cruza. Cada moneda es una
 * consulta propia (`["price-history", coinId, days]`, la misma que usa el
 * detalle de moneda), así React Query reutiliza las que ya estén cargadas al
 * añadir o quitar otra.
 */
export function useComparison(coins: Coin[], days: number): ComparisonState {
  const { market } = useDeps();
  const queries = useQueries({
    queries: coins.map((coin) => marketQueries.priceHistory(market, coin.id, days)),
  });

  const isPending = queries.some((q) => q.isPending);
  const isError = queries.some((q) => q.isError);
  const isFetching = queries.some((q) => q.isFetching);
  const errorMessage = queries.find((q) => q.isError)?.error?.message ?? "";

  const comparison = useMemo<Comparison>(
    () =>
      compareCoins(
        coins,
        queries.map((q) => q.data),
        days,
      ),
    // Las consultas cambian de identidad en cada render; lo que importa para
    // recalcular es qué monedas hay, qué periodo y si ya llegaron los datos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coins, days, queries.map((q) => q.dataUpdatedAt).join(",")],
  );

  return {
    ...comparison,
    isPending,
    isError,
    errorMessage,
    isFetching,
    refetch: () => {
      // Conservado: reintentar relanza todas las consultas, no solo la que falló.
      for (const q of queries) void q.refetch();
    },
  };
}
