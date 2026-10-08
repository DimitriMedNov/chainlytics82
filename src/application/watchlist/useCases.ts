import {
  nextFavorite,
  type WatchlistCoinRef,
  type WatchlistEntry,
} from "../../domain/watchlist/entries.ts";
import type { WatchlistRepository } from "./ports.ts";

export function listWatchlist(repository: WatchlistRepository): Promise<WatchlistEntry[]> {
  return repository.list();
}

/** Empieza a seguir una moneda. */
export function addToWatchlist(
  repository: WatchlistRepository,
  coin: WatchlistCoinRef,
): Promise<void> {
  return repository.add(coin);
}

/** Deja de seguir una moneda. */
export function removeFromWatchlist(repository: WatchlistRepository, symbol: string): Promise<void> {
  return repository.remove(symbol);
}

/** Marca o desmarca como favorita, según cómo esté ahora en `entries`. */
export function toggleWatchlistFavorite(
  repository: WatchlistRepository,
  entries: WatchlistEntry[],
  symbol: string,
): Promise<void> {
  return repository.setFavorite(symbol, nextFavorite(entries, symbol));
}
