import type { AccountImportPort } from "@/application/sync/migrateLocalData";
import { err, ok } from "@/domain/shared/result";
import { entryCoinId } from "@/domain/watchlist/entries";
import type { SupabaseDb } from "@/infrastructure/shared/supabaseDb";

/** Sube a Supabase lo que el usuario tenía guardado en el navegador. */
export function createSupabaseAccountImport(client: SupabaseDb): AccountImportPort {
  return {
    // La watchlist sí tiene clave natural (usuario + moneda), así que un
    // upsert la deja idempotente por sí solo.
    async importWatchlist(userId, entries) {
      const { error } = await client.from("watchlist_items").upsert(
        entries.map((entry) => ({
          user_id: userId,
          coin_id: entryCoinId(entry),
          symbol: entry.symbol,
          is_favorite: entry.isFavorite,
        })),
        { onConflict: "user_id,coin_id", ignoreDuplicates: true },
      );
      return error ? err(error.message) : ok(undefined);
    },

    async importTransactions(userId, transactions) {
      const { error } = await client.from("portfolio_transactions").insert(
        transactions.map((tx) => ({
          user_id: userId,
          coin_id: tx.coinId,
          symbol: tx.symbol,
          kind: tx.kind,
          amount: tx.amount,
          unit_price: tx.unitPrice,
          happened_at: tx.happenedAt,
        })),
      );
      return error ? err(error.message) : ok(undefined);
    },
  };
}
