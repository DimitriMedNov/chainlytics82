import { useMemo, useState } from "react";
import type { Coin } from "@/types/coin";

export type MarketSortKey = "marketcap" | "volume" | "change" | "price" | "rank";
export type MarketFilter = "all" | "gainers" | "losers";

export const MARKET_FILTERS: ReadonlyArray<{ value: MarketFilter; label: string }> = [
  { value: "all", label: "Todas las monedas" },
  { value: "gainers", label: "Suben en 24 h" },
  { value: "losers", label: "Bajan en 24 h" },
];

export const MARKET_SORTS: ReadonlyArray<{ value: MarketSortKey; label: string }> = [
  { value: "marketcap", label: "Capitalización" },
  { value: "volume", label: "Volumen 24 h" },
  { value: "change", label: "Cambio 24 h" },
  { value: "price", label: "Precio" },
  { value: "rank", label: "Ranking" },
];

function sortCoins(coins: Coin[], key: MarketSortKey): Coin[] {
  const copy = [...coins];
  switch (key) {
    case "marketcap":
      return copy.sort((a, b) => b.marketCap - a.marketCap);
    case "volume":
      return copy.sort((a, b) => b.volume24h - a.volume24h);
    case "change":
      return copy.sort((a, b) => b.change24h - a.change24h);
    case "price":
      return copy.sort((a, b) => b.price - a.price);
    case "rank":
      return copy.sort((a, b) => a.rank - b.rank);
  }
}

/** Búsqueda, filtro de subida/bajada y orden del listado de mercados. */
export function useMarketFilters(coins: Coin[] | undefined) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<MarketSortKey>("marketcap");
  const [filter, setFilter] = useState<MarketFilter>("all");

  const visibleCoins = useMemo(() => {
    if (!coins) return [];
    const needle = searchTerm.trim().toLowerCase();
    const filtered = coins.filter((coin) => {
      const matchesSearch =
        needle === "" ||
        coin.name.toLowerCase().includes(needle) ||
        coin.symbol.toLowerCase().includes(needle);
      const matchesFilter =
        filter === "all" ||
        (filter === "gainers" && coin.change24h > 0) ||
        (filter === "losers" && coin.change24h < 0);
      return matchesSearch && matchesFilter;
    });
    return sortCoins(filtered, sortBy);
  }, [coins, searchTerm, filter, sortBy]);

  const clear = () => {
    setSearchTerm("");
    setFilter("all");
  };

  return { searchTerm, setSearchTerm, sortBy, setSortBy, filter, setFilter, visibleCoins, clear };
}
