import { ArrowRightLeft, Heart, X } from "lucide-react";
import type { CoinDetailView } from "@/application/coin-detail/presentation/coinDetailView";
import { COIN_DETAIL_TEXTS as T } from "@/application/coin-detail/presentation/texts";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { DialogClose, DialogDescription, DialogTitle } from "@/ui/animate-ui/components/radix/dialog";
import { Badge } from "@/ui/base/badge";
import { CoinAvatar, SaveStatus } from "@/ui/shared";

export interface CoinDetailHeaderProps {
  header: CoinDetailView["header"];
  isInWatchlist: boolean;
  isSaving: boolean;
  saveErrorMessage: string;
  onDismissSaveError: () => void;
  onToggleWatchlist: () => void;
  onConvert: () => void;
}

export interface CoinDetailCloseButtonProps {
  className?: string;
}

/** Botón de cerrar propio, en español y de 44 px (el del registro dice «Close»). */
export function CoinDetailCloseButton({ className }: CoinDetailCloseButtonProps) {
  return (
    <DialogClose
      aria-label="Cerrar el detalle"
      data-slot="coin-detail-close"
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      <X className="size-5" aria-hidden="true" />
    </DialogClose>
  );
}

/**
 * Cabecera fija del modal: logo de 56 px, nombre (título accesible del diálogo,
 * solo el nombre), símbolo, ranking y las dos acciones.
 */
export function CoinDetailHeader({
  header,
  isInWatchlist,
  isSaving,
  saveErrorMessage,
  onDismissSaveError,
  onToggleWatchlist,
  onConvert,
}: CoinDetailHeaderProps) {
  return (
    <header data-slot="coin-detail-header" className="flex flex-col gap-3 border-b px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex items-start gap-3">
        {/* 56 px: `CoinAvatar` llega a 40, se amplía con la clase del proyecto. */}
        <CoinAvatar src={header.image} symbol={header.symbol} size="lg" priority className="size-14 text-base" />
        <div className="flex min-w-0 flex-1 flex-col gap-1 self-center">
          <DialogTitle className="type-title truncate text-foreground">{header.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Precio, evolución y cifras de mercado de {header.name}.
          </DialogDescription>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium uppercase">{header.symbol}</span>
            <Badge variant="outline" className="type-num">
              <span className="sr-only">Puesto </span>
              {header.rankLabel}
            </Badge>
          </p>
        </div>
        <CoinDetailCloseButton className="-mr-2 -mt-1" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={isInWatchlist ? "secondary" : "outline"}
          className="min-h-11 flex-1 sm:flex-none"
          data-slot="coin-detail-follow"
          data-following={isInWatchlist}
          onClick={onToggleWatchlist}
        >
          <Heart className={cn(isInWatchlist && "fill-current")} aria-hidden="true" />
          {isInWatchlist ? T.following : T.follow}
        </Button>
        <Button
          type="button"
          className="min-h-11 flex-1 sm:flex-none"
          data-slot="coin-detail-convert"
          onClick={onConvert}
        >
          <ArrowRightLeft aria-hidden="true" />
          {T.convert}
        </Button>
        <SaveStatus
          isSaving={isSaving}
          errorMessage={saveErrorMessage}
          onDismissError={onDismissSaveError}
          className="basis-full sm:basis-auto"
        />
      </div>
    </header>
  );
}
