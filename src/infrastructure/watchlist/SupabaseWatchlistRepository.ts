import { RepositoryError } from "@/application/shared/errors";
import type { WatchlistRepository } from "@/application/watchlist/ports";
import type { WatchlistEntry } from "@/domain/watchlist/entries";
import type { SupabaseDb } from "@/infrastructure/shared/supabaseDb";

/** Fila de `watchlist_items` tal como la devuelve la consulta (DTO). */
interface WatchlistRowDto {
  coin_id: string;
  symbol: string;
  is_favorite: boolean;
}

export function toWatchlistEntry(row: WatchlistRowDto): WatchlistEntry {
  return {
    id: row.coin_id,
    symbol: row.symbol.toUpperCase(),
    isFavorite: row.is_favorite,
  };
}

/** Watchlist con sesión: vive en la cuenta del usuario y le sigue entre dispositivos. */
export function createSupabaseWatchlistRepository(
  client: SupabaseDb,
  userId: string,
): WatchlistRepository {
  return {
    async list() {
      const { data, error } = await client
        .from("watchlist_items")
        .select("coin_id, symbol, is_favorite")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw new RepositoryError(error.message);
      return (data ?? []).map(toWatchlistEntry);
    },

    // Conservado: es un `insert`, no un upsert: añadir una moneda que ya está
    // falla (inventario §9, punto 4).
    async add(coin) {
      const { error } = await client.from("watchlist_items").insert({
        user_id: userId,
        coin_id: coin.id,
        symbol: coin.symbol.toUpperCase(),
      });
      if (error) throw new RepositoryError(error.message);
    },

    // Conservado: se borra por símbolo, no por id de moneda; dos monedas con
    // el mismo símbolo se borran juntas (inventario §9, punto 4).
    async remove(symbol) {
      const { error } = await client
        .from("watchlist_items")
        .delete()
        .eq("user_id", userId)
        .eq("symbol", symbol.toUpperCase());
      if (error) throw new RepositoryError(error.message);
    },

    // Conservado: se marca por símbolo, no por id de moneda (inventario §9, punto 4).
    async setFavorite(symbol, isFavorite) {
      const { error } = await client
        .from("watchlist_items")
        .update({ is_favorite: isFavorite })
        .eq("user_id", userId)
        .eq("symbol", symbol.toUpperCase());
      if (error) throw new RepositoryError(error.message);
    },
  };
}
