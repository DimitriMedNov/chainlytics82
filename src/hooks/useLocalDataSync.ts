import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  clearLocalWatchlist,
  readLocalWatchlist,
  writeLocalWatchlist,
  type WatchlistEntry,
} from "@/hooks/useWatchlist";
import {
  clearLocalTransactions,
  readLocalTransactions,
  writeLocalTransactions,
} from "@/hooks/usePortfolio";
import type { Transaction } from "@/types/portfolio";

/**
 * Al iniciar sesión, sube a la cuenta lo que estuviera guardado solo en este
 * navegador.
 *
 * Los movimientos no tienen clave natural, así que subirlos dos veces los
 * duplica. Para que no pase, se vacía el almacenamiento local ANTES de subir
 * (una escritura síncrona que cierra la ventana en la que dos arranques
 * simultáneos leerían lo mismo) y, si la subida falla, se devuelven a su
 * sitio.
 */
export function useLocalDataSync(): void {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const migratedFor = useRef<string | null>(null);

  useEffect(() => {
    const userId = user?.id;
    if (!userId || migratedFor.current === userId) return;
    migratedFor.current = userId;

    // Se toma el contenido y se vacía en el mismo tic, antes de cualquier await.
    const watchlist: WatchlistEntry[] = readLocalWatchlist();
    const transactions: Transaction[] = readLocalTransactions();
    if (watchlist.length === 0 && transactions.length === 0) return;

    clearLocalWatchlist();
    clearLocalTransactions();

    let cancelled = false;

    const run = async () => {
      let movidos = 0;

      if (watchlist.length > 0) {
        // La watchlist sí tiene clave natural (usuario + moneda), así que un
        // upsert la deja idempotente por sí solo.
        const { error } = await supabase.from("watchlist_items").upsert(
          watchlist.map((entry) => ({
            user_id: userId,
            coin_id: entry.id === "" ? entry.symbol.toLowerCase() : entry.id,
            symbol: entry.symbol,
            is_favorite: entry.isFavorite,
          })),
          { onConflict: "user_id,coin_id", ignoreDuplicates: true },
        );
        if (error) {
          writeLocalWatchlist(watchlist);
        } else {
          movidos += watchlist.length;
        }
      }

      if (transactions.length > 0) {
        const { error } = await supabase.from("portfolio_transactions").insert(
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
        if (error) {
          writeLocalTransactions(transactions);
        } else {
          movidos += transactions.length;
        }
      }

      if (cancelled || movidos === 0) return;

      void queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      void queryClient.invalidateQueries({ queryKey: ["portfolio-transactions", userId] });
      toast.success("Datos guardados en tu cuenta", {
        description: `Movimos ${movidos} ${movidos === 1 ? "elemento" : "elementos"} de este navegador a tu cuenta.`,
      });
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [user?.id, queryClient]);
}
