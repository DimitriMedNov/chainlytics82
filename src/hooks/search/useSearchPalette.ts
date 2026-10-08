import { useCallback, useEffect, useMemo, useState } from "react";
import { searchStatusMessage } from "@/application/search/messages";
import type { CoinSearchResult } from "@/domain/market/coin";
import { limitResults, resolveSearchStatus, type SearchStatus } from "@/domain/search/rules";
import { useCoinSearch } from "@/hooks/market/useMarketData";
import { SEARCH_DEBOUNCE_MS, useDebounced } from "@/hooks/search/useDebounced";

export interface SearchPalette {
  /** Lo que hay escrito en la caja, sin retraso. */
  query: string;
  setQuery: (query: string) => void;
  /** Como mucho 12. Vacío en cualquier estado que no sea `results`. */
  results: CoinSearchResult[];
  status: SearchStatus;
  /** Texto del estado actual; "" cuando hay resultados. */
  message: string;
  /** Mensaje del fallo de la búsqueda; "" si no falló. */
  errorMessage: string;
  /** true mientras hay una petición de búsqueda en curso (también al reintentar). */
  isFetching: boolean;
  /** Repite la última búsqueda. Para el botón de reintentar del estado de error. */
  refetch: () => void;
}

/** Texto, búsqueda retrasada y estado de la paleta. `isOpen` es si está abierta. */
export function useSearchPalette(isOpen: boolean): SearchPalette {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, SEARCH_DEBOUNCE_MS);
  const search = useCoinSearch(debouncedQuery);

  // Al cerrar, limpiamos para no reabrir con la búsqueda anterior.
  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const results = useMemo(() => limitResults(search.data ?? []), [search.data]);
  const status = resolveSearchStatus({
    query: debouncedQuery,
    resultCount: results.length,
    isFetching: search.isFetching,
    isError: search.isError,
  });
  const errorMessage = search.error?.message ?? "";

  const { refetch: refetchSearch } = search;
  const refetch = useCallback(() => {
    void refetchSearch();
  }, [refetchSearch]);

  return {
    query,
    setQuery,
    results,
    status,
    message: searchStatusMessage(status, errorMessage),
    errorMessage,
    isFetching: search.isFetching,
    refetch,
  };
}
