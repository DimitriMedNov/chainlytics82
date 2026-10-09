import { useId } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { CoinDetailView, DetailRow } from "@/application/coin-detail/presentation/coinDetailView";
import { COIN_DETAIL_TEXTS as T } from "@/application/coin-detail/presentation/texts";
import type { DayRangePosition } from "@/domain/coin-detail/figures";
import { cn } from "@/lib/utils";
import { priceChangeVariants } from "@/ui/shared";
import { DetailRows } from "@/ui/coin-detail/DetailRows";
import { RatioBarSlot } from "@/ui/coin-detail/RatioBarSlot";

export interface CoinPriceSummaryProps {
  price: CoinDetailView["price"];
  /** Máximo y mínimo de 24 h, máximo y mínimo histórico. */
  rows: DetailRow[];
  dayRange: DayRangePosition;
}

/** Texto ya formateado de una fila, para rotular los extremos de la barra. */
function rowValue(rows: DetailRow[], id: string): string | undefined {
  return rows.find((row) => row.id === id)?.value;
}

/**
 * Precio actual con su cambio de 24 h (flecha + signo + color), el de 7 d si
 * existe, la barra del rango de 24 h y las cuatro cifras de máximos y mínimos.
 */
export function CoinPriceSummary({ price, rows, dayRange }: CoinPriceSummaryProps) {
  const titleId = useId();
  const up = price.trend === "up";
  const TrendIcon = up ? TrendingUp : TrendingDown;

  return (
    <section
      aria-labelledby={titleId}
      data-slot="coin-price-summary"
      className="grid gap-4 md:grid-cols-5 md:items-center md:gap-5"
    >
      <div className="flex min-w-0 flex-col gap-2 md:col-span-2">
        <h3 id={titleId} className="type-eyebrow text-muted-foreground">
          {price.label}
        </h3>
        <p data-slot="coin-price-value" className="type-figure-lg break-words text-foreground">
          {price.value}
        </p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span
            data-slot="coin-price-change"
            data-trend={price.trend}
            className={cn(priceChangeVariants({ direction: up ? "up" : "down", appearance: "badge", size: "md" }), "gap-1")}
          >
            <TrendIcon aria-hidden="true" />
            <span className="sr-only">{up ? T.trend.rises : T.trend.falls} </span>
            {price.change24h}
          </span>
          <span>{price.change24hSuffix}</span>
          {price.change7d ? <span className="type-num">{price.change7d}</span> : null}
        </p>
        {dayRange.ratio !== null ? (
          <RatioBarSlot
            variant="marker"
            ratio={dayRange.ratio}
            label={T.dayRangeBarLabel}
            startLabel={rowValue(rows, "low24h")}
            endLabel={rowValue(rows, "high24h")}
            className="mt-2"
          />
        ) : null}
      </div>

      <DetailRows rows={rows} layout="tiles" className="md:col-span-3" />
    </section>
  );
}
