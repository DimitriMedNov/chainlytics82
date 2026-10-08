import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { WatchlistRepository } from "@/application/watchlist/ports";
import { useDeps } from "@/app/deps";
import type { WatchlistCoinRef, WatchlistEntry } from "@/domain/watchlist/entries";

/**
 * Las tres acciones de la watchlist sobre el repositorio recibido. No saben
 * si guardan en el navegador o en la cuenta.
 */
// Conservado: las mutaciones no tienen `onError` ni actualización optimista
// (inventario §9, punto 5). El fallo queda expuesto en `saveErrorMessage`
// para que la interfaz nueva pueda pintarlo.
export function useWatchlistMutations(repository: WatchlistRepository, userId: string | null) {
  const { watchlist } = useDeps();
  const queryClient = useQueryClient();

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
  }, [queryClient, userId]);

  const addMutation = useMutation({
    mutationFn: (coin: WatchlistCoinRef) => watchlist.add(repository, coin),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (symbol: string) => watchlist.remove(repository, symbol),
    onSuccess: invalidate,
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ symbol, entries }: { symbol: string; entries: WatchlistEntry[] }) =>
      watchlist.toggleFavorite(repository, entries, symbol),
    onSuccess: invalidate,
  });

  const failed = [addMutation, removeMutation, favoriteMutation].find((m) => m.isError);

  const clearSaveError = useCallback(() => {
    addMutation.reset();
    removeMutation.reset();
    favoriteMutation.reset();
  }, [addMutation, removeMutation, favoriteMutation]);

  return {
    addMutation,
    removeMutation,
    favoriteMutation,
    isSaving: addMutation.isPending || removeMutation.isPending || favoriteMutation.isPending,
    saveErrorMessage: failed?.error?.message ?? "",
    clearSaveError,
  };
}
