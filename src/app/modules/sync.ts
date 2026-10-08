import type { ObservableStore } from "@/application/shared/ports";
import { migrateLocalData } from "@/application/sync/migrateLocalData";
import type { Transaction } from "@/domain/portfolio/types";
import type { WatchlistEntry } from "@/domain/watchlist/entries";
import { createSupabaseAccountImport } from "@/infrastructure/sync/SupabaseAccountImport";
import { supabase } from "@/integrations/supabase/client";

export interface SyncModule {
  /** Sube a la cuenta lo guardado en este navegador. Devuelve cuántos elementos movió. */
  migrateLocalData(userId: string): Promise<number>;
}

/** Sincronización local → cuenta. Usa los mismos almacenes locales que watchlist y portfolio. */
export function createSyncModule(
  localWatchlist: ObservableStore<WatchlistEntry[]>,
  localTransactions: ObservableStore<Transaction[]>,
): SyncModule {
  const ports = {
    localWatchlist,
    localTransactions,
    account: createSupabaseAccountImport(supabase),
  };
  return { migrateLocalData: (userId) => migrateLocalData(ports, userId) };
}
