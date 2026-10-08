export { SearchProvider, type SearchProviderProps } from "@/hooks/search/SearchProvider";
export { type SearchValue } from "@/hooks/search/SearchContext";
export { useSearch } from "@/hooks/search/useSearch";
export { SEARCH_DEBOUNCE_MS, useDebounced } from "@/hooks/search/useDebounced";
export { useSearchShortcutHint } from "@/hooks/search/useSearchShortcutHint";
export { useSearchPalette, type SearchPalette } from "@/hooks/search/useSearchPalette";
export { useSelectedCoin, type SelectedCoin } from "@/hooks/search/useSelectedCoin";
export {
  useGlobalSearch,
  type GlobalSearch,
  type UseGlobalSearchOptions,
} from "@/hooks/search/useGlobalSearch";
