import type { KeyValueStorage, ObservableStore } from "@/application/shared/ports";
import type { WatchlistRepository } from "@/application/watchlist/ports";
import {
  addToWatchlist,
  listWatchlist,
  removeFromWatchlist,
  toggleWatchlistFavorite,
} from "@/application/watchlist/useCases";
import type { WatchlistEntry } from "@/domain/watchlist/entries";
import {
  createLocalWatchlistRepository,
  createLocalWatchlistStore,
} from "@/infrastructure/watchlist/LocalWatchlistRepository";
import { createSupabaseWatchlistRepository } from "@/infrastructure/watchlist/SupabaseWatchlistRepository";
import { supabase } from "@/integrations/supabase/client";

export interface WatchlistModule {
  /** La watchlist de este navegador, observable (la usa también la sincronización). */
  local: ObservableStore<WatchlistEntry[]>;
  /**
   * Factory: entrega el repositorio que toca. Sin sesión (`null`), el de este
   * navegador; con sesión, el de la cuenta de ese usuario.
   */
  repositoryFor(userId: string | null): WatchlistRepository;
  list: typeof listWatchlist;
  add: typeof addToWatchlist;
  remove: typeof removeFromWatchlist;
  toggleFavorite: typeof toggleWatchlistFavorite;
}

export function createWatchlistModule(storage: KeyValueStorage): WatchlistModule {
  const local = createLocalWatchlistStore(storage);
  const localRepository = createLocalWatchlistRepository(local);

  return {
    local,
    repositoryFor: (userId) =>
      userId === null ? localRepository : createSupabaseWatchlistRepository(supabase, userId),
    list: listWatchlist,
    add: addToWatchlist,
    remove: removeFromWatchlist,
    toggleFavorite: toggleWatchlistFavorite,
  };
}
