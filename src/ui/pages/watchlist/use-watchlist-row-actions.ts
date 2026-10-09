import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { WatchlistCoin } from "@/domain/watchlist/entries";
import type { WatchlistScreen } from "@/hooks/watchlist-screen/useWatchlistScreen";
import { notify } from "@/ui/shared";

/** Lo que una fila puede hacer; cada función recibe la moneda de la fila. */
export interface WatchlistRowHandlers {
  onToggleFavorite: (item: WatchlistCoin) => void;
  onOpenDetail: (item: WatchlistCoin) => void;
  onConvert: (item: WatchlistCoin) => void;
  onRemove: (item: WatchlistCoin) => void;
}

/**
 * Une las acciones del hook de la pantalla con lo que es de la interfaz:
 * navegar y enseñar el aviso. Los avisos de quitar y de convertir eran neutros
 * en la interfaz anterior (sin variante), así que van con `notify.info`.
 */
export function useWatchlistRowActions(actions: WatchlistScreen["actions"]): WatchlistRowHandlers {
  const navigate = useNavigate();
  const { toggleFavorite, remove, convert, openDetail } = actions;

  const onToggleFavorite = useCallback(
    (item: WatchlistCoin) => toggleFavorite(item.symbol),
    [toggleFavorite],
  );

  const onRemove = useCallback(
    (item: WatchlistCoin) => {
      const notice = remove(item.symbol);
      notify.info(notice.title, { description: notice.description });
    },
    [remove],
  );

  const onConvert = useCallback(
    (item: WatchlistCoin) => {
      const intent = convert(item);
      navigate(intent.to);
      notify.info(intent.notice.title, { description: intent.notice.description });
    },
    [convert, navigate],
  );

  return useMemo(
    () => ({ onToggleFavorite, onOpenDetail: openDetail, onConvert, onRemove }),
    [onToggleFavorite, openDetail, onConvert, onRemove],
  );
}
