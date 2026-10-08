import { TrendingDown, TrendingUp } from "lucide-react";
import { investedNote } from "@/application/portfolio-screen/messages";
import { formatCurrency, formatPercent } from "@/application/shared/presentation/format";
import type { SummaryFigures } from "@/domain/portfolio-screen/gain";
import { cn } from "@/lib/utils";
import { Stat, StatGrid } from "@/ui/shared";
import { GainText } from "@/ui/pages/portfolio/GainText";
import { useStaggeredEntrance } from "@/ui/pages/portfolio/hooks/useStaggeredEntrance";

export interface SummaryCardsProps {
  /** `screen.figures`: las cifras ya calculadas de las cuatro tarjetas. */
  figures: SummaryFigures;
  className?: string;
}

/**
 * Las cuatro cifras de cabecera: valor, invertido y las dos ganancias.
 * Movimiento (Anime.js): las cuatro tarjetas entran una tras otra. Las cifras
 * llegan ya formateadas, así que entran con el fundido de su tarjeta.
 */
export function SummaryCards({ figures, className }: SummaryCardsProps) {
  const { unrealized } = figures;
  const TrendIcon = figures.change24hRises ? TrendingUp : TrendingDown;
  const gridRef = useStaggeredEntrance<HTMLDListElement>('[data-slot="stat"]');

  return (
    <StatGrid ref={gridRef} columns={4} className={className} data-slot="portfolio-summary">
      <Stat
        size="lg"
        label="Valor actual"
        value={formatCurrency(figures.value)}
        hint={
          <span
            className={cn(
              "type-num inline-flex items-center gap-1 font-medium",
              figures.change24hRises ? "text-success" : "text-warning",
            )}
          >
            <TrendIcon className="size-3.5 shrink-0" aria-hidden="true" />
            {formatPercent(figures.change24hPct)} en 24 h
          </span>
        }
      />
      <Stat
        size="lg"
        label="Invertido"
        value={formatCurrency(figures.invested)}
        hint={investedNote(figures.positionsWithoutCost)}
      />
      <Stat
        size="lg"
        label="Ganancia sobre el papel"
        value={<GainText gain={figures.unrealized} showPct={false} className="font-semibold" />}
        hint={
          <>
            {unrealized.known && unrealized.pct !== null ? (
              <span className={cn("type-num mr-1.5 font-medium", unrealized.rises ? "text-success" : "text-warning")}>
                ({formatPercent(unrealized.pct)})
              </span>
            ) : null}
            Si vendieras hoy
          </>
        }
      />
      <Stat
        size="lg"
        label="Ganancia realizada"
        value={<GainText gain={figures.realized} className="font-semibold" />}
        hint="De lo que ya vendiste"
      />
    </StatGrid>
  );
}
