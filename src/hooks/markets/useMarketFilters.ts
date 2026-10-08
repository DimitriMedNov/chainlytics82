import { useCallback, useMemo, useState } from "react";
import { marketListTitle } from "@/application/markets/presentation/texts";
import type { Coin } from "@/domain/market/coin";
import {
  buildChangeBars,
  buildTrendBreakdown,
  type ChangeBar,
  type TrendSlice,
} from "@/domain/markets/charts";
import type { MarketFilter } from "@/domain/markets/filters";
import {
  clearCriteria,
  DEFAULT_MARKET_CRITERIA,
  hasActiveCriteria,
  resolveMarketListStatus,
  selectVisibleCoins,
  type MarketCriteria,
  type MarketListStatus,
} from "@/domain/markets/listing";
import type { MarketSortKey } from "@/domain/markets/sorting";
import { useMarkets } from "@/hooks/market/useMarketData";

export interface UseMarketFiltersResult {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filter: MarketFilter;
  setFilter: (value: MarketFilter) => void;
  sortBy: MarketSortKey;
  setSortBy: (value: MarketSortKey) => void;
  /** Borra búsqueda y filtro. No toca el orden. */
  clear: () => void;
  hasActiveFilters: boolean;
  /** Lista ya buscada, filtrada y ordenada. */
  visibleCoins: Coin[];
  visibleCount: number;
  /** Monedas que devolvió la API, antes de filtrar. */
  totalCount: number;
  /** "{n} criptomonedas" o "Criptomonedas" mientras carga o falla. */
  listTitle: string;
  status: MarketListStatus;
  /** Mensaje del fallo de carga; `""` si no hay. */
  errorMessage: string;
  refetch: () => void;
  /** `true` mientras hay una petición en curso (también el refresco de fondo). */
  isFetching: boolean;
  /** Barras de cambio 24 h de las monedas visibles, en el orden de la lista. */
  changeBars: ChangeBar[];
  /** Reparto suben / bajan / sin cambio de las monedas visibles. */
  trendBreakdown: TrendSlice[];
}

/**
 * Estado de la tarjeta de filtros de Mercados y la lista que resulta, sobre
 * la consulta de mercados compartida (`useMarkets`). No hace peticiones nuevas.
 */
export function useMarketFilters(): UseMarketFiltersResult {
  const { data, isPending, isError, error, refetch, isFetching } = useMarkets();
  const [criteria, setCriteria] = useState<MarketCriteria>(DEFAULT_MARKET_CRITERIA);

  const setSearchTerm = useCallback(
    (searchTerm: string) => setCriteria((current) => ({ ...current, searchTerm })),
    [],
  );
  const setFilter = useCallback(
    (filter: MarketFilter) => setCriteria((current) => ({ ...current, filter })),
    [],
  );
  const setSortBy = useCallback(
    (sortBy: MarketSortKey) => setCriteria((current) => ({ ...current, sortBy })),
    [],
  );
  const clear = useCallback(() => setCriteria(clearCriteria), []);
  const retry = useCallback(() => void refetch(), [refetch]);

  const visibleCoins = useMemo(() => selectVisibleCoins(data, criteria), [data, criteria]);
  const changeBars = useMemo(() => buildChangeBars(visibleCoins), [visibleCoins]);
  const trendBreakdown = useMemo(() => buildTrendBreakdown(visibleCoins), [visibleCoins]);

  const totalCount = data?.length ?? 0;
  const visibleCount = visibleCoins.length;
  const status = resolveMarketListStatus({ isError, isPending, totalCount, visibleCount });

  return {
    searchTerm: criteria.searchTerm,
    setSearchTerm,
    filter: criteria.filter,
    setFilter,
    sortBy: criteria.sortBy,
    setSortBy,
    clear,
    hasActiveFilters: hasActiveCriteria(criteria),
    visibleCoins,
    visibleCount,
    totalCount,
    listTitle: marketListTitle(status, visibleCount),
    status,
    errorMessage: isError ? error.message : "",
    refetch: retry,
    isFetching,
    changeBars,
    trendBreakdown,
  };
}
