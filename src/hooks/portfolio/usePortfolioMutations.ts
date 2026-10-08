import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PortfolioRepository } from "@/application/portfolio/ports";
import { useDeps } from "@/app/deps";
import type { NewTransaction } from "@/domain/portfolio/types";

/**
 * Las tres acciones del portfolio sobre el repositorio recibido. No saben si
 * guardan en el navegador o en la cuenta.
 */
// Conservado: las mutaciones no tienen `onError` ni actualización optimista
// (inventario §9, punto 5). El fallo queda expuesto en `saveErrorMessage`
// para que la interfaz nueva pueda pintarlo.
export function usePortfolioMutations(repository: PortfolioRepository, userId: string | null) {
  const { portfolio } = useDeps();
  const queryClient = useQueryClient();

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["portfolio-transactions", userId] });
  }, [queryClient, userId]);

  const addMutation = useMutation({
    mutationFn: (tx: NewTransaction) => portfolio.add(repository, tx),
    onSuccess: invalidate,
  });

  const setCostMutation = useMutation({
    mutationFn: ({ coinId, unitPrice }: { coinId: string; unitPrice: number }) =>
      portfolio.setMissingCost(repository, coinId, unitPrice),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => portfolio.remove(repository, id),
    onSuccess: invalidate,
  });

  const failed = [addMutation, setCostMutation, removeMutation].find((m) => m.isError);

  const clearSaveError = useCallback(() => {
    addMutation.reset();
    setCostMutation.reset();
    removeMutation.reset();
  }, [addMutation, setCostMutation, removeMutation]);

  return {
    addMutation,
    setCostMutation,
    removeMutation,
    isSaving: addMutation.isPending || removeMutation.isPending || setCostMutation.isPending,
    saveErrorMessage: failed?.error?.message ?? "",
    clearSaveError,
  };
}
