import { ArrowLeftRight, Check, Eye, Trash2 } from "lucide-react";
import { rowLabels } from "@/application/watchlist-screen/texts";
import type { WatchlistCoin } from "@/domain/watchlist/entries";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { FavoriteStar } from "@/ui/pages/watchlist/favorite-star";
import type { WatchlistRowHandlers } from "@/ui/pages/watchlist/use-watchlist-row-actions";

const ICON_BUTTON = "size-11 text-muted-foreground";

export interface WatchlistRowActionsProps extends WatchlistRowHandlers {
  item: WatchlistCoin;
  /** El usuario acaba de marcarla como favorita: la estrella rebota una vez. */
  celebrate: boolean;
  beat: number;
  /** La fila ya se quitó y está saliendo: la papelera enseña la marca de hecho. */
  removed: boolean;
}

/** Los cuatro botones de una fila: favorita, detalle, convertir y quitar. */
export function WatchlistRowActions({
  item,
  celebrate,
  beat,
  removed,
  onToggleFavorite,
  onOpenDetail,
  onConvert,
  onRemove,
}: WatchlistRowActionsProps) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-action="favorite"
        aria-pressed={item.isFavorite}
        aria-label={rowLabels.favorite(item)}
        onClick={() => onToggleFavorite(item)}
        className={cn(ICON_BUTTON, item.isFavorite && "text-chart-3")}
      >
        <FavoriteStar active={item.isFavorite} celebrate={celebrate} beat={beat} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={rowLabels.details(item)}
        onClick={() => onOpenDetail(item)}
        className={ICON_BUTTON}
      >
        <Eye aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={rowLabels.convert(item)}
        onClick={() => onConvert(item)}
        className={ICON_BUTTON}
      >
        <ArrowLeftRight aria-hidden="true" />
      </Button>
      {/*
        «Inline confirm» de Bencho, solo como respuesta visual: el botón cede al
        pasar y al pulsar (0,97 / 0,94, nunca crece) y, ya quitada la fila, la
        papelera pasa a ser la marca de hecho mientras la fila sale. Quitar
        sigue siendo inmediato: sin paso de confirmación ni deshacer.
      */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-action="remove"
        hoverScale={0.97}
        tapScale={0.94}
        aria-label={rowLabels.remove(item)}
        onClick={() => onRemove(item)}
        className={cn(ICON_BUTTON, "hover:text-destructive")}
      >
        {removed ? <Check aria-hidden="true" /> : <Trash2 aria-hidden="true" />}
      </Button>
    </div>
  );
}
