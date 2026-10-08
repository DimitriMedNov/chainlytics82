import { useCallback, useState } from "react";
import { sortArrow } from "@/application/watchlist-screen/texts";
import {
  DEFAULT_SORT,
  nextSort,
  type SortField,
  type SortState,
} from "@/domain/watchlist-screen/sort";

/** Estado del orden de la pantalla. Al repetir clave, invierte el sentido. */
export function useWatchlistSort() {
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);

  const toggle = useCallback((field: SortField) => {
    setSort((current) => nextSort(current, field));
  }, []);

  return {
    /** Para pasárselo a las funciones de dominio. */
    state: sort,
    field: sort.field,
    order: sort.order,
    /** "↑" o "↓" según el sentido actual. */
    arrow: sortArrow(sort.order),
    isActive: (field: SortField) => sort.field === field,
    toggle,
    sortByName: useCallback(() => toggle("name"), [toggle]),
    sortByPrice: useCallback(() => toggle("price"), [toggle]),
    sortByChange: useCallback(() => toggle("change"), [toggle]),
  };
}

export type WatchlistSortControls = ReturnType<typeof useWatchlistSort>;
