import { COIN_DETAIL_TEXTS as T } from "@/application/coin-detail/presentation/texts";
import { DialogDescription, DialogTitle } from "@/ui/animate-ui/components/radix/dialog";
import { ChartSkeleton, LoadingRegion, Skeleton } from "@/ui/shared";
import { CoinDetailCloseButton } from "@/ui/coin-detail/CoinDetailHeader";

const TILES = ["high24h", "low24h", "ath", "atl"] as const;
const CARDS = ["marketCap", "volume", "additional"] as const;

/**
 * Modal abierto sin moneda todavía (pasa desde el buscador global): esqueleto
 * con la forma de la cabecera, el precio, la gráfica y las tarjetas de cifras.
 */
export function CoinDetailSkeleton() {
  return (
    <>
      <header data-slot="coin-detail-header" className="flex items-start gap-3 border-b px-4 py-3 sm:px-5 sm:py-4">
        <DialogTitle className="sr-only">{T.skeletonTitle}</DialogTitle>
        <DialogDescription className="sr-only">{T.skeletonDescription}</DialogDescription>
        <LoadingRegion label={T.skeletonLoading} className="min-w-0 flex-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-14 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-7 w-40 max-w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-11 flex-1 sm:w-28 sm:flex-none" />
              <Skeleton className="h-11 flex-1 sm:w-28 sm:flex-none" />
            </div>
          </div>
        </LoadingRegion>
        <CoinDetailCloseButton className="-mr-2 -mt-1" />
      </header>

      <div aria-hidden="true" className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-5 md:items-center md:gap-5">
          <div className="flex flex-col gap-2 md:col-span-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8.5 w-44 max-w-full" />
            <Skeleton className="h-6 w-36" />
            <Skeleton className="mt-2 h-2 w-full rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:col-span-3">
            {TILES.map((tile) => (
              <Skeleton key={tile} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />
          <ChartSkeleton height="md" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <Skeleton key={card} className="h-44 rounded-lg" />
          ))}
        </div>
      </div>
    </>
  );
}
