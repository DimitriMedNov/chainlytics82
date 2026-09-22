import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { NewTransaction, Transaction } from "@/types/portfolio";

const STORAGE_KEY = "chainlytics.portfolio.movimientos";
/** Clave anterior, cuando solo guardábamos cantidades sin coste. */
const LEGACY_KEY = "chainlytics.portfolio";

function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.coinId === "string" &&
    typeof item.symbol === "string" &&
    (item.kind === "compra" || item.kind === "venta") &&
    typeof item.amount === "number" &&
    Number.isFinite(item.amount) &&
    (item.unitPrice === null || typeof item.unitPrice === "number") &&
    typeof item.happenedAt === "string"
  );
}

/**
 * Las posiciones del formato viejo no tenían precio de compra. Se convierten
 * en una compra con coste desconocido: la cantidad se conserva y el coste se
 * queda sin saber, que es la verdad.
 */
function migrateLegacy(raw: unknown): Transaction[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const old = item as Record<string, unknown>;
    if (typeof old.id !== "string" || typeof old.amount !== "number") return [];
    return [
      {
        id: `legacy-${old.id}`,
        coinId: old.id,
        symbol: typeof old.symbol === "string" ? old.symbol.toUpperCase() : "",
        kind: "compra" as const,
        amount: old.amount,
        unitPrice: null,
        happenedAt: new Date().toISOString(),
      },
    ];
  });
}

export function readLocalTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter(isTransaction) : [];
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migradas = migrateLegacy(JSON.parse(legacy) as unknown);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migradas));
      return migradas;
    }
  } catch {
    // Almacenamiento corrupto o bloqueado: empezamos de cero.
  }
  return [];
}

export function writeLocalTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // Almacenamiento bloqueado: los movimientos viven solo en esta sesión.
  }
}

export function clearLocalTransactions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Nada que hacer.
  }
}

async function fetchRemote(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("portfolio_transactions")
    .select("id, coin_id, symbol, kind, amount, unit_price, happened_at")
    .eq("user_id", userId)
    .order("happened_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    coinId: row.coin_id,
    symbol: row.symbol.toUpperCase(),
    kind: row.kind,
    amount: Number(row.amount),
    unitPrice: row.unit_price === null ? null : Number(row.unit_price),
    happenedAt: row.happened_at,
  }));
}

/**
 * Movimientos del portfolio. Con sesión iniciada viven en Supabase; sin
 * sesión, en este navegador.
 */
export function usePortfolio() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  const [localTransactions, setLocalTransactions] =
    useState<Transaction[]>(readLocalTransactions);

  const remote = useQuery({
    queryKey: ["portfolio-transactions", userId],
    queryFn: () => fetchRemote(userId as string),
    enabled: userId !== null,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (userId === null) writeLocalTransactions(localTransactions);
  }, [localTransactions, userId]);

  const transactions = useMemo(
    () => (userId === null ? localTransactions : (remote.data ?? [])),
    [userId, localTransactions, remote.data],
  );

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["portfolio-transactions", userId] });
  }, [queryClient, userId]);

  const addMutation = useMutation({
    mutationFn: async (tx: NewTransaction) => {
      const { error } = await supabase.from("portfolio_transactions").insert({
        user_id: userId as string,
        coin_id: tx.coinId,
        symbol: tx.symbol.toUpperCase(),
        kind: tx.kind,
        amount: tx.amount,
        unit_price: tx.unitPrice,
        happened_at: tx.happenedAt,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  const setCostMutation = useMutation({
    mutationFn: async ({ coinId, unitPrice }: { coinId: string; unitPrice: number }) => {
      const { error } = await supabase
        .from("portfolio_transactions")
        .update({ unit_price: unitPrice })
        .eq("user_id", userId as string)
        .eq("coin_id", coinId)
        .is("unit_price", null);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("portfolio_transactions")
        .delete()
        .eq("user_id", userId as string)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidate,
  });

  const addTransaction = useCallback(
    (tx: NewTransaction) => {
      if (userId === null) {
        setLocalTransactions((current) => [
          ...current,
          { ...tx, id: `local-${Date.now()}-${current.length}` },
        ]);
        return;
      }
      addMutation.mutate(tx);
    },
    [userId, addMutation],
  );

  /**
   * Pone precio a los movimientos de una moneda que no lo tenían. No añade
   * nada: rellena el hueco de lo que ya estaba registrado.
   */
  const setMissingCost = useCallback(
    (coinId: string, unitPrice: number) => {
      if (userId === null) {
        setLocalTransactions((current) =>
          current.map((tx) =>
            tx.coinId === coinId && tx.unitPrice === null ? { ...tx, unitPrice } : tx,
          ),
        );
        return;
      }
      setCostMutation.mutate({ coinId, unitPrice });
    },
    [userId, setCostMutation],
  );

  const removeTransaction = useCallback(
    (id: string) => {
      if (userId === null) {
        setLocalTransactions((current) => current.filter((tx) => tx.id !== id));
        return;
      }
      removeMutation.mutate(id);
    },
    [userId, removeMutation],
  );

  return {
    transactions,
    addTransaction,
    removeTransaction,
    setMissingCost,
    isError: remote.isError,
    errorMessage: remote.error?.message ?? "",
    isRefetching: remote.isFetching,
    refetch: () => void remote.refetch(),
    isPending: userId !== null && remote.isPending,
    isSaving: addMutation.isPending || removeMutation.isPending || setCostMutation.isPending,
    isSynced: userId !== null,
  };
}
