import { useMemo, useState } from "react";
import type { WatchlistCoin } from "@/hooks/useWatchlist";

export type SortField = "name" | "price" | "change";
export type SortOrder = "asc" | "desc";

/** Ordenación de la watchlist. Al repetir campo, invierte el sentido. */
export function useWatchlistSorting(items: WatchlistCoin[]) {
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(field);
    setSortOrder("asc");
  };

  const sortedItems = useMemo(() => {
    const direction = sortOrder === "asc" ? 1 : -1;
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, "es") * direction;
        case "price":
          return (a.price - b.price) * direction;
        case "change":
          return (a.change24h - b.change24h) * direction;
      }
    });
  }, [items, sortBy, sortOrder]);

  return { sortBy, sortOrder, sortedItems, handleSort };
}
