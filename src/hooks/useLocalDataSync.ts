import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { clearLocalWatchlist, readLocalWatchlist } from "@/hooks/useWatchlist";
import { clearLocalTransactions, readLocalTransactions } from "@/hooks/usePortfolio";

/**
 * Al iniciar sesión, sube a la cuenta lo que estuviera guardado solo en este
 * navegador. `upsert` con ignoreDuplicates evita pisar lo que ya hubiera en
 * la nube: si la moneda ya está, gana la versión de la cuenta.
 */
export function useLocalDataSync(): void {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const migratedFor = useRef<string | null>(null);

  useEffect(() => {
    const userId = user?.id;
    if (!userId || migratedFor.current === userId) return;
    migratedFor.current = userId;

    const localWatchlist = readLocalWatchlist();
    const localTransactions = readLocalTransactions();
    if (localWatchlist.length === 0 && localTransactions.length === 0) return;

    let cancelled = false;

    const run = async () => {
      let movidos = 0;

      if (localWatchlist.length > 0) {
        const { error } = await supabase.from("watchlist_items").upsert(
          localWatchlist.map((entry) => ({
            user_id: userId,
            coin_id: entry.id === "" ? entry.symbol.toLowerCase() : entry.id,
            symbol: entry.symbol,
            is_favorite: entry.isFavorite,
          })),
          { onConflict: "user_id,coin_id", ignoreDuplicates: true },
        );
        if (!error) {
          clearLocalWatchlist();
          movidos += localWatchlist.length;
        }
      }

      if (localTransactions.length > 0) {
        // Los movimientos no tienen clave natural, así que se insertan tal
        // cual: si ya subiste estos, estarías duplicándolos, y por eso solo
        // se hace una vez por usuario y después se borra lo local.
        const { error } = await supabase.from("portfolio_transactions").insert(
          localTransactions.map((tx) => ({
            user_id: userId,
            coin_id: tx.coinId,
            symbol: tx.symbol,
            kind: tx.kind,
            amount: tx.amount,
            unit_price: tx.unitPrice,
            happened_at: tx.happenedAt,
          })),
        );
        if (!error) {
          clearLocalTransactions();
          movidos += localTransactions.length;
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
