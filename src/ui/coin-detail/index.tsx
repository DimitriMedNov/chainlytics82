import { motion } from "motion/react";
import type { Coin } from "@/domain/market/coin";
import { useCoinDetail } from "@/hooks/coin-detail/useCoinDetail";
import { Dialog, DialogContent } from "@/ui/animate-ui/components/radix/dialog";
import { CoinDetailHeader } from "@/ui/coin-detail/CoinDetailHeader";
import { CoinDetailSkeleton } from "@/ui/coin-detail/CoinDetailSkeleton";
import { CoinMetricCards } from "@/ui/coin-detail/CoinMetricCards";
import { CoinPriceChartSection } from "@/ui/coin-detail/CoinPriceChartSection";
import { CoinPriceSummary } from "@/ui/coin-detail/CoinPriceSummary";
import { useCoinDetailActions } from "@/ui/coin-detail/useCoinDetailActions";
import {
  FADE_HIDDEN,
  FADE_TRANSITION,
  FADE_VISIBLE,
  useArrivedAfterSkeleton,
  useDialogEntrance,
} from "@/ui/coin-detail/useCoinDetailMotion";
import { useDisplayedCoin } from "@/ui/coin-detail/useDisplayedCoin";
import { useReturnFocus } from "@/ui/coin-detail/useReturnFocus";

export interface CoinDetailDialogProps {
  /** La moneda a enseñar. Con `null` y el modal abierto se pinta el esqueleto. */
  coin: Coin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de detalle de una moneda. Lo abren Mercados, Watchlist y el buscador.
 *
 *   const [coin, setCoin] = useState<Coin | null>(null);
 *   <CoinDetailDialog coin={coin} open={coin !== null} onOpenChange={(o) => !o && setCoin(null)} />
 *
 * Solo pinta: datos, textos y acciones salen de `useCoinDetail`.
 * Alto: `max-h-[95dvh]` / `sm:max-h-[90dvh]` son los límites del inventario
 * (1.4 n.º 1); no hay token de alto de ventana equivalente.
 *
 * Movimiento (Motion): el diálogo entra con fundido + escala corta; el
 * contenido solo se funde cuando sustituye al esqueleto. La app ya envuelve
 * todo en `MotionConfig reducedMotion="user"` (`AppRoot`).
 */
export function CoinDetailDialog({ coin, open, onOpenChange }: CoinDetailDialogProps) {
  const shownCoin = useDisplayedCoin(coin, open);
  const detail = useCoinDetail(shownCoin, open);
  const actions = useCoinDetailActions(detail, onOpenChange);
  const { view, figures } = detail;
  const entrance = useDialogEntrance();
  const returnFocus = useReturnFocus();
  const arrivedAfterSkeleton = useArrivedAfterSkeleton(open, view !== null && figures !== null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        {...entrance}
        onOpenAutoFocus={returnFocus.onOpenAutoFocus}
        onCloseAutoFocus={returnFocus.onCloseAutoFocus}
        showCloseButton={false}
        data-slot="coin-detail-dialog"
        className="flex max-h-[95dvh] flex-col gap-0 overflow-hidden rounded-xl bg-popover p-0 shadow-overlay sm:max-h-[90dvh] sm:max-w-4xl"
      >
        {view && figures ? (
          <motion.div
            data-slot="coin-detail-content"
            initial={arrivedAfterSkeleton ? FADE_HIDDEN : false}
            animate={FADE_VISIBLE}
            transition={FADE_TRANSITION}
            className="flex min-h-0 flex-1 flex-col"
          >
            <CoinDetailHeader
              header={view.header}
              isInWatchlist={detail.isInWatchlist}
              isSaving={detail.isSaving}
              saveErrorMessage={detail.saveErrorMessage}
              onDismissSaveError={detail.clearSaveError}
              onToggleWatchlist={actions.onToggleWatchlist}
              onConvert={actions.onConvert}
            />
            <div
              data-slot="coin-detail-body"
              className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain p-4 sm:gap-6 sm:p-5"
            >
              <CoinPriceSummary price={view.price} rows={view.priceRows} dayRange={figures.dayRange} />
              <CoinPriceChartSection chart={detail.chart} coinName={view.header.name} />
              <CoinMetricCards
                marketCap={view.marketCap}
                volume={view.volume}
                additional={view.additional}
                figures={figures}
              />
            </div>
          </motion.div>
        ) : (
          <CoinDetailSkeleton />
        )}
      </DialogContent>
    </Dialog>
  );
}
