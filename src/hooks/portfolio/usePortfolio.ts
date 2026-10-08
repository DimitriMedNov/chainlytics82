import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDeps } from "@/app/deps";
import type { NewTransaction } from "@/domain/portfolio/types";
import { usePortfolioMutations } from "@/hooks/portfolio/usePortfolioMutations";
import { useSession } from "@/hooks/session/useSession";

/**
 * Movimientos del portfolio. Con sesión iniciada viven en Supabase; sin
 * sesión, en este navegador (en un almacén observable compartido).
 */
export function usePortfolio() {
  const { portfolio } = useDeps();
  const { user } = useSession();
  const userId = user?.id ?? null;

  // El repositorio que toca según haya sesión o no.
  const repository = useMemo(() => portfolio.repositoryFor(userId), [portfolio, userId]);

  const localTransactions = useSyncExternalStore(
    portfolio.local.subscribe,
    portfolio.local.getSnapshot,
  );

  const remote = useQuery({
    queryKey: ["portfolio-transactions", userId],
    queryFn: () => portfolio.list(repository),
    enabled: userId !== null,
    staleTime: 30_000,
  });

  const transactions = useMemo(
    () => (userId === null ? localTransactions : (remote.data ?? [])),
    [userId, localTransactions, remote.data],
  );

  const mutations = usePortfolioMutations(repository, userId);
  const { addMutation, setCostMutation, removeMutation } = mutations;

  const addTransaction = useCallback((tx: NewTransaction) => addMutation.mutate(tx), [addMutation]);

  /**
   * Pone precio a los movimientos de una moneda que no lo tenían. No añade
   * nada: rellena el hueco de lo que ya estaba registrado.
   */
  const setMissingCost = useCallback(
    (coinId: string, unitPrice: number) => setCostMutation.mutate({ coinId, unitPrice }),
    [setCostMutation],
  );

  const removeTransaction = useCallback((id: string) => removeMutation.mutate(id), [removeMutation]);

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
    isSaving: mutations.isSaving,
    /** Mensaje del último cambio que no se pudo guardar; "" si no hay. */
    saveErrorMessage: mutations.saveErrorMessage,
    /** Olvida el error de guardado (por ejemplo, al cerrar el aviso). */
    clearSaveError: mutations.clearSaveError,
    isSynced: userId !== null,
  };
}
