import type { PortfolioRepository } from "@/application/portfolio/ports";
import { RepositoryError } from "@/application/shared/errors";
import type { Transaction } from "@/domain/portfolio/types";
import type { SupabaseDb } from "@/infrastructure/shared/supabaseDb";

/** Fila de `portfolio_transactions` tal como la devuelve la consulta (DTO). */
interface TransactionRowDto {
  id: string;
  coin_id: string;
  symbol: string;
  kind: "compra" | "venta";
  amount: number;
  unit_price: number | null;
  happened_at: string;
}

export function toTransaction(row: TransactionRowDto): Transaction {
  return {
    id: row.id,
    coinId: row.coin_id,
    symbol: row.symbol.toUpperCase(),
    kind: row.kind,
    amount: Number(row.amount),
    unitPrice: row.unit_price === null ? null : Number(row.unit_price),
    happenedAt: row.happened_at,
  };
}

/** Portfolio con sesión: los movimientos viven en la cuenta del usuario. */
export function createSupabasePortfolioRepository(
  client: SupabaseDb,
  userId: string,
): PortfolioRepository {
  return {
    async list() {
      const { data, error } = await client
        .from("portfolio_transactions")
        .select("id, coin_id, symbol, kind, amount, unit_price, happened_at")
        .eq("user_id", userId)
        .order("happened_at", { ascending: true });

      if (error) throw new RepositoryError(error.message);
      return (data ?? []).map(toTransaction);
    },

    async add(tx) {
      const { error } = await client.from("portfolio_transactions").insert({
        user_id: userId,
        coin_id: tx.coinId,
        symbol: tx.symbol.toUpperCase(),
        kind: tx.kind,
        amount: tx.amount,
        unit_price: tx.unitPrice,
        happened_at: tx.happenedAt,
      });
      if (error) throw new RepositoryError(error.message);
    },

    async setMissingCost(coinId, unitPrice) {
      const { error } = await client
        .from("portfolio_transactions")
        .update({ unit_price: unitPrice })
        .eq("user_id", userId)
        .eq("coin_id", coinId)
        .is("unit_price", null);
      if (error) throw new RepositoryError(error.message);
    },

    async remove(id) {
      const { error } = await client
        .from("portfolio_transactions")
        .delete()
        .eq("user_id", userId)
        .eq("id", id);
      if (error) throw new RepositoryError(error.message);
    },
  };
}
