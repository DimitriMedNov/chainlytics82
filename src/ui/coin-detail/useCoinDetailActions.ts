import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { CoinDetail } from "@/hooks/coin-detail/useCoinDetail";
import { notify } from "@/ui/shared";

export interface CoinDetailActions {
  /** Añade o quita de la watchlist y enseña el aviso que devuelve el caso de uso. */
  onToggleWatchlist: () => void;
  /** Cierra el modal, navega al convertidor y enseña el aviso si lo hubiera. */
  onConvert: () => void;
}

/**
 * Cablea las dos acciones del modal con lo que solo sabe la interfaz: avisos,
 * navegación y cerrar el diálogo. Qué se añade, a dónde se navega y qué dice
 * el aviso lo decide `useCoinDetail`.
 */
export function useCoinDetailActions(
  detail: Pick<CoinDetail, "toggleWatchlist" | "convert">,
  onOpenChange: (open: boolean) => void,
): CoinDetailActions {
  const navigate = useNavigate();
  const { toggleWatchlist, convert } = detail;

  const onToggleWatchlist = useCallback(() => {
    const result = toggleWatchlist();
    if (!result) return;
    const show = result.action === "added" ? notify.success : notify.info;
    show(result.notice.title, { description: result.notice.description });
  }, [toggleWatchlist]);

  const onConvert = useCallback(() => {
    const { route, notice } = convert();
    // El orden se conserva: primero se cierra el modal, después se navega.
    onOpenChange(false);
    navigate(route);
    if (notice) notify.info(notice.title, { description: notice.description });
  }, [convert, navigate, onOpenChange]);

  return { onToggleWatchlist, onConvert };
}
