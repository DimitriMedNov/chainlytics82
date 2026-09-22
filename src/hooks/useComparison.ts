import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchPriceHistory } from "@/lib/coingecko";
import { compareSeries, type Comparison, type Series } from "@/lib/compareMath";
import type { Coin } from "@/types/coin";

/** Más de cinco líneas no se distinguen, y cada moneda es una petición. */
export const MAX_MONEDAS = 5;

export interface ComparisonState extends Comparison {
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  isFetching: boolean;
  refetch: () => void;
}

/**
 * Pide el histórico de cada moneda elegida y los cruza. Cada moneda es una
 * consulta propia, así React Query reutiliza las que ya estén cargadas al
 * añadir o quitar otra.
 */
export function useComparison(coins: Coin[], days: number): ComparisonState {
  const queries = useQueries({
    queries: coins.map((coin) => ({
      queryKey: ["price-history", coin.id, days],
      queryFn: ({ signal }: { signal: AbortSignal }) => fetchPriceHistory(coin.id, days, signal),
      staleTime: 5 * 60_000,
    })),
  });

  const isPending = queries.some((q) => q.isPending);
  const isError = queries.some((q) => q.isError);
  const isFetching = queries.some((q) => q.isFetching);
  const errorMessage = queries.find((q) => q.isError)?.error?.message ?? "";

  const comparison = useMemo<Comparison>(() => {
    if (coins.length === 0) return { rows: [], results: [] };

    const series: Series[] = coins.flatMap((coin, index) => {
      const puntos = queries[index]?.data;
      return puntos ? [{ coinId: coin.id, symbol: coin.symbol, points: puntos }] : [];
    });

    return compareSeries(series, days);
    // Las consultas cambian de identidad en cada render; lo que importa para
    // recalcular es qué monedas hay, qué periodo y si ya llegaron los datos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coins, days, queries.map((q) => q.dataUpdatedAt).join(",")]);

  return {
    ...comparison,
    isPending,
    isError,
    errorMessage,
    isFetching,
    refetch: () => {
      for (const q of queries) void q.refetch();
    },
  };
}
