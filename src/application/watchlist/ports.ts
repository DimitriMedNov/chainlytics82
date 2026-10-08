import type { WatchlistCoinRef, WatchlistEntry } from "../../domain/watchlist/entries.ts";

/**
 * Dónde vive la watchlist. Hay dos implementaciones intercambiables
 * (Strategy): este navegador y la cuenta del usuario. Quien la usa no sabe
 * cuál tiene delante.
 *
 * Los métodos lanzan `RepositoryError` si el almacenamiento falla.
 */
export interface WatchlistRepository {
  list(): Promise<WatchlistEntry[]>;
  add(coin: WatchlistCoinRef): Promise<void>;
  remove(symbol: string): Promise<void>;
  setFavorite(symbol: string, isFavorite: boolean): Promise<void>;
}
