import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Coin } from "@/types/coin";

const STORAGE_KEY = "chainlytics.watchlist";
/** Clave de la versión anterior, que guardaba precios congelados. */
const LEGACY_KEY = "crypto-watchlist";

/** Lo único que persistimos. El precio siempre viene en vivo de la API. */
export interface WatchlistEntry {
  id: string;
  symbol: string;
  isFavorite: boolean;
}

/** Una entrada ya cruzada con los datos de mercado actuales. */
export interface WatchlistCoin extends Coin {
  isFavorite: boolean;
}

function isEntry(value: unknown): value is WatchlistEntry {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.symbol === "string" && typeof item.isFavorite === "boolean";
}

/** Convierte el formato viejo ({id: number, price, change}) al nuevo. */
function migrateLegacy(raw: unknown): WatchlistEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const old = item as Record<string, unknown>;
    if (typeof old.symbol !== "string") return [];
    return [
      {
        id: typeof old.coinId === "string" ? old.coinId : "",
        symbol: old.symbol.toUpperCase(),
        isFavorite: old.isFavorite === true,
      },
    ];
  });
}

export function readLocalWatchlist(): WatchlistEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = migrateLegacy(JSON.parse(legacy) as unknown);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    // localStorage corrupto o bloqueado: empezamos de cero en vez de romper la vista.
  }
  return [];
}

export function writeLocalWatchlist(entries: WatchlistEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Modo incógnito con almacenamiento bloqueado: la lista vive solo en memoria.
  }
}

export function clearLocalWatchlist(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Nada que hacer si el almacenamiento está bloqueado.
  }
}

async function fetchRemote(userId: string): Promise<WatchlistEntry[]> {
  const { data, error } = await supabase
    .from("watchlist_items")
    .select("coin_id, symbol, is_favorite")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.coin_id,
    symbol: row.symbol.toUpperCase(),
    isFavorite: row.is_favorite,
  }));
}

/**
 * Watchlist del usuario. Con sesión iniciada vive en Supabase y te sigue
 * entre dispositivos; sin sesión, en este navegador.
 */
export function useWatchlist() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  const [localEntries, setLocalEntries] = useState<WatchlistEntry[]>(readLocalWatchlist);

  const remote = useQuery({
    queryKey: ["watchlist", userId],
    queryFn: () => fetchRemote(userId as string),
    enabled: userId !== null,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (userId === null) writeLocalWatchlist(localEntries);
  }, [localEntries, userId]);

  const entries = useMemo(
    () => (userId === null ? localEntries : (remote.data ?? [])),
    [userId, localEntries, remote.data],
  );

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
  }, [queryClient, userId]);

  const addMutation = useMutation({
    mutationFn: async (coin: Pick<Coin, "id" | "symbol">) => {
      const { error } = await supabase.from("watchlist_items").insert({
        user_id: userId as string,
        coin_id: coin.id,
        symbol: coin.symbol.toUpperCase(),
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: async (symbol: string) => {
      const { error } = await supabase
        .from("watchlist_items")
        .delete()
        .eq("user_id", userId as string)
        .eq("symbol", symbol.toUpperCase());
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  const favoriteMutation = useMutation({
    mutationFn: async ({ symbol, isFavorite }: { symbol: string; isFavorite: boolean }) => {
      const { error } = await supabase
        .from("watchlist_items")
        .update({ is_favorite: isFavorite })
        .eq("user_id", userId as string)
        .eq("symbol", symbol.toUpperCase());
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  const has = useCallback(
    (symbol: string) => entries.some((entry) => entry.symbol === symbol.toUpperCase()),
    [entries],
  );

  const add = useCallback(
    (coin: Pick<Coin, "id" | "symbol">) => {
      if (userId === null) {
        setLocalEntries((current) => {
          const symbol = coin.symbol.toUpperCase();
          if (current.some((entry) => entry.symbol === symbol)) return current;
          return [...current, { id: coin.id, symbol, isFavorite: false }];
        });
        return;
      }
      addMutation.mutate(coin);
    },
    [userId, addMutation],
  );

  const remove = useCallback(
    (symbol: string) => {
      if (userId === null) {
        setLocalEntries((current) =>
          current.filter((entry) => entry.symbol !== symbol.toUpperCase()),
        );
        return;
      }
      removeMutation.mutate(symbol);
    },
    [userId, removeMutation],
  );

  const toggleFavorite = useCallback(
    (symbol: string) => {
      const current = entries.find((entry) => entry.symbol === symbol.toUpperCase());
      if (userId === null) {
        setLocalEntries((items) =>
          items.map((entry) =>
            entry.symbol === symbol.toUpperCase()
              ? { ...entry, isFavorite: !entry.isFavorite }
              : entry,
          ),
        );
        return;
      }
      favoriteMutation.mutate({ symbol, isFavorite: !(current?.isFavorite ?? false) });
    },
    [userId, entries, favoriteMutation],
  );

  return {
    entries,
    has,
    add,
    remove,
    toggleFavorite,
    /** Solo con sesión: si la lectura desde Supabase falló. */
    isError: remote.isError,
    errorMessage: remote.error?.message ?? "",
    isPending: userId !== null && remote.isPending,
    isSynced: userId !== null,
  };
}

/** Cruza las entradas guardadas con los precios en vivo. */
export function joinWithMarket(
  entries: WatchlistEntry[],
  coins: Coin[] | undefined,
): WatchlistCoin[] {
  if (!coins) return [];
  return entries.flatMap((entry) => {
    const coin = coins.find((item) => item.symbol === entry.symbol || item.id === entry.id);
    return coin ? [{ ...coin, isFavorite: entry.isFavorite }] : [];
  });
}
