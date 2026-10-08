import type { KeyValueStorage, ObservableStore } from "@/application/shared/ports";
import type { WatchlistRepository } from "@/application/watchlist/ports";
import {
  addEntry,
  migrateLegacyWatchlist,
  parseStoredWatchlist,
  removeEntry,
  setEntryFavorite,
  type WatchlistEntry,
} from "@/domain/watchlist/entries";
import { createLocalStorageStore } from "@/infrastructure/shared/localStorageStore";

const STORAGE_KEY = "chainlytics.watchlist";
/** Clave de la versión anterior, que guardaba precios congelados. */
const LEGACY_KEY = "crypto-watchlist";

const EMPTY: WatchlistEntry[] = [];

/** La watchlist guardada en este navegador, observable. */
export function createLocalWatchlistStore(
  storage: KeyValueStorage,
): ObservableStore<WatchlistEntry[]> {
  return createLocalStorageStore<WatchlistEntry[]>({
    storage,
    key: STORAGE_KEY,
    legacyKey: LEGACY_KEY,
    empty: EMPTY,
    parse: parseStoredWatchlist,
    migrate: migrateLegacyWatchlist,
  });
}

/** Watchlist sin sesión: vive en el almacén local. */
export function createLocalWatchlistRepository(
  store: ObservableStore<WatchlistEntry[]>,
): WatchlistRepository {
  return {
    async list() {
      return store.getSnapshot();
    },
    async add(coin) {
      store.update((current) => addEntry(current, coin));
    },
    async remove(symbol) {
      store.update((current) => removeEntry(current, symbol));
    },
    async setFavorite(symbol, isFavorite) {
      store.update((current) => setEntryFavorite(current, symbol, isFavorite));
    },
  };
}
