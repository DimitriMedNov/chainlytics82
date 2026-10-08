import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDeps } from "@/app/deps";
import { hasSymbol, type WatchlistCoinRef } from "@/domain/watchlist/entries";
import { useSession } from "@/hooks/session/useSession";
import { useWatchlistMutations } from "@/hooks/watchlist/useWatchlistMutations";

/**
 * Watchlist del usuario. Con sesión iniciada vive en Supabase y te sigue
 * entre dispositivos; sin sesión, en este navegador.
 *
 * Sin sesión todas las pantallas leen el mismo almacén observable, así que
 * un cambio hecho en una (el modal de detalle) se ve al instante en las demás.
 */
export function useWatchlist() {
  const { watchlist } = useDeps();
  const { user } = useSession();
  const userId = user?.id ?? null;

  // El repositorio que toca según haya sesión o no: a partir de aquí las
  // acciones no saben dónde se guarda.
  const repository = useMemo(() => watchlist.repositoryFor(userId), [watchlist, userId]);

  const localEntries = useSyncExternalStore(
    watchlist.local.subscribe,
    watchlist.local.getSnapshot,
  );

  const remote = useQuery({
    queryKey: ["watchlist", userId],
    queryFn: () => watchlist.list(repository),
    enabled: userId !== null,
    staleTime: 30_000,
  });

  const entries = useMemo(
    () => (userId === null ? localEntries : (remote.data ?? [])),
    [userId, localEntries, remote.data],
  );

  const mutations = useWatchlistMutations(repository, userId);
  const { addMutation, removeMutation, favoriteMutation } = mutations;

  const has = useCallback((symbol: string) => hasSymbol(entries, symbol), [entries]);

  const add = useCallback((coin: WatchlistCoinRef) => addMutation.mutate(coin), [addMutation]);

  const remove = useCallback((symbol: string) => removeMutation.mutate(symbol), [removeMutation]);

  const toggleFavorite = useCallback(
    (symbol: string) => favoriteMutation.mutate({ symbol, entries }),
    [favoriteMutation, entries],
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
    isRefetching: remote.isFetching,
    refetch: () => void remote.refetch(),
    isPending: userId !== null && remote.isPending,
    isSynced: userId !== null,
    /** true mientras se guarda un cambio (añadir, quitar o favorito). */
    isSaving: mutations.isSaving,
    /** Mensaje del último cambio que no se pudo guardar; "" si no hay. */
    saveErrorMessage: mutations.saveErrorMessage,
    /** Olvida el error de guardado (por ejemplo, al cerrar el aviso). */
    clearSaveError: mutations.clearSaveError,
  };
}
