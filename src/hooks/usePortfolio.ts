import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Coin } from "@/types/coin";

const STORAGE_KEY = "chainlytics.portfolio";

/** Lo que guardamos: qué moneda y cuánta. El valor se calcula con el precio en vivo. */
export interface Holding {
  id: string;
  symbol: string;
  amount: number;
}

/** Una posición ya valorada a precio de mercado. */
export interface ValuedHolding extends Holding {
  name: string;
  image: string;
  price: number;
  change24h: number;
  value: number;
}

export interface PortfolioTotals {
  value: number;
  /** Cuánto ha cambiado el total en 24 h, en dólares y en porcentaje. */
  change24hValue: number;
  change24hPct: number;
  best: ValuedHolding | null;
}

function isHolding(value: unknown): value is Holding {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.symbol === "string" &&
    typeof item.amount === "number" &&
    Number.isFinite(item.amount)
  );
}

export function readLocalPortfolio(): Holding[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isHolding) : [];
  } catch {
    return [];
  }
}

function writeLocalPortfolio(holdings: Holding[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
  } catch {
    // Almacenamiento bloqueado: las posiciones viven solo en esta sesión.
  }
}

export function clearLocalPortfolio(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nada que hacer si el almacenamiento está bloqueado.
  }
}

async function fetchRemote(userId: string): Promise<Holding[]> {
  const { data, error } = await supabase
    .from("portfolio_holdings")
    .select("coin_id, symbol, amount")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.coin_id,
    symbol: row.symbol.toUpperCase(),
    amount: Number(row.amount),
  }));
}

/**
 * Posiciones del portfolio. Con sesión iniciada viven en Supabase; sin
 * sesión, en este navegador.
 */
export function usePortfolio() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  const [localHoldings, setLocalHoldings] = useState<Holding[]>(readLocalPortfolio);

  const remote = useQuery({
    queryKey: ["portfolio", userId],
    queryFn: () => fetchRemote(userId as string),
    enabled: userId !== null,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (userId === null) writeLocalPortfolio(localHoldings);
  }, [localHoldings, userId]);

  const holdings = useMemo(
    () => (userId === null ? localHoldings : (remote.data ?? [])),
    [userId, localHoldings, remote.data],
  );

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["portfolio", userId] });
  }, [queryClient, userId]);

  const addMutation = useMutation({
    mutationFn: async ({ coin, amount }: { coin: Pick<Coin, "id" | "symbol">; amount: number }) => {
      const existing = holdings.find((item) => item.id === coin.id);
      const total = (existing?.amount ?? 0) + amount;

      const { error } = await supabase.from("portfolio_holdings").upsert(
        {
          user_id: userId as string,
          coin_id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          amount: total,
        },
        { onConflict: "user_id,coin_id" },
      );
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: async (coinId: string) => {
      const { error } = await supabase
        .from("portfolio_holdings")
        .delete()
        .eq("user_id", userId as string)
        .eq("coin_id", coinId);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  /** Añade una posición. Si ya tienes esa moneda, suma la cantidad. */
  const addHolding = useCallback(
    (coin: Pick<Coin, "id" | "symbol">, amount: number) => {
      if (userId === null) {
        setLocalHoldings((current) => {
          const existing = current.find((item) => item.id === coin.id);
          if (existing) {
            return current.map((item) =>
              item.id === coin.id ? { ...item, amount: item.amount + amount } : item,
            );
          }
          return [...current, { id: coin.id, symbol: coin.symbol.toUpperCase(), amount }];
        });
        return;
      }
      addMutation.mutate({ coin, amount });
    },
    [userId, addMutation],
  );

  const removeHolding = useCallback(
    (id: string) => {
      if (userId === null) {
        setLocalHoldings((current) => current.filter((item) => item.id !== id));
        return;
      }
      removeMutation.mutate(id);
    },
    [userId, removeMutation],
  );

  return {
    holdings,
    addHolding,
    removeHolding,
    isError: remote.isError,
    errorMessage: remote.error?.message ?? "",
    isPending: userId !== null && remote.isPending,
    isSynced: userId !== null,
  };
}

/** Valora las posiciones con los precios de mercado actuales. */
export function valueHoldings(holdings: Holding[], coins: Coin[] | undefined): ValuedHolding[] {
  if (!coins) return [];
  return holdings.flatMap((holding) => {
    const coin = coins.find((item) => item.id === holding.id || item.symbol === holding.symbol);
    if (!coin) return [];
    return [
      {
        ...holding,
        name: coin.name,
        image: coin.image,
        price: coin.price,
        change24h: coin.change24h,
        value: coin.price * holding.amount,
      },
    ];
  });
}

/**
 * Totales del portfolio. El cambio de 24 h sale de deshacer el porcentaje de
 * cada moneda para saber cuánto valía ayer, no de un número inventado.
 */
export function portfolioTotals(valued: ValuedHolding[]): PortfolioTotals {
  const value = valued.reduce((sum, item) => sum + item.value, 0);

  const valueYesterday = valued.reduce((sum, item) => {
    const factor = 1 + item.change24h / 100;
    return sum + (factor > 0 ? item.value / factor : item.value);
  }, 0);

  const change24hValue = value - valueYesterday;
  const change24hPct = valueYesterday > 0 ? (change24hValue / valueYesterday) * 100 : 0;

  const best = valued.reduce<ValuedHolding | null>(
    (winner, item) => (winner === null || item.change24h > winner.change24h ? item : winner),
    null,
  );

  return { value, change24hValue, change24hPct, best };
}
