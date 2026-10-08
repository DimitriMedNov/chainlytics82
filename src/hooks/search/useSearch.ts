import { useContext } from "react";
import { SearchContext, type SearchValue } from "@/hooks/search/SearchContext";

/** Estado de apertura del buscador global, compartido entre la barra y la paleta. */
export function useSearch(): SearchValue {
  return useContext(SearchContext);
}
