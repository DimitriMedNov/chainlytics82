import { useMemo, useState } from "react";
import { joinWithMarket, type WatchlistEntry } from "@/hooks/useWatchlist";
import { useWatchlistSorting } from "@/hooks/useWatchlistSorting";
import type { Coin } from "@/types/coin";

/** Cruza la watchlist con los precios, la filtra por búsqueda y la parte en favoritas y resto. */
export function useWatchlistView(entries: WatchlistEntry[], market: Coin[] | undefined) {
  const [searchTerm, setSearchTerm] = useState("");

  const coins = useMemo(() => joinWithMarket(entries, market), [entries, market]);

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (needle === "") return coins;
    return coins.filter(
      (item) =>
        item.name.toLowerCase().includes(needle) || item.symbol.toLowerCase().includes(needle),
    );
  }, [coins, searchTerm]);

  const { sortBy, sortOrder, sortedItems, handleSort } = useWatchlistSorting(filteredItems);

  return {
    coins,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    handleSort,
    sortedItems,
    favoriteItems: sortedItems.filter((item) => item.isFavorite),
    otherItems: sortedItems.filter((item) => !item.isFavorite),
  };
}
