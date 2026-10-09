import { weightAriaLabel } from "@/application/portfolio-screen/messages";
import { formatPercentShare } from "@/application/shared/presentation/format";
import type { DistributionSlice } from "@/domain/portfolio-screen/series";
import { cn } from "@/lib/utils";
import { Progress, ProgressIndicator } from "@/ui/animate-ui/primitives/radix/progress";
import { weightBarTransition } from "@/ui/pages/portfolio/motion";
import { seriesColorClass } from "@/ui/pages/portfolio/seriesColors";

export interface WeightListProps {
  /** `screen.distribution`: una porción por posición, en el orden de los colores. */
  slices: DistributionSlice[];
  className?: string;
}

/**
 * «Peso de cada moneda»: símbolo, porcentaje y barra con el color de su porción.
 * Movimiento (Motion, vía `ProgressIndicator` de Animate UI): la barra crece
 * desde cero hasta su valor en medio segundo, en vez del muelle lento de origen
 * que partía de la barra llena. Con «reducir movimiento» sale ya en su valor.
 */
export function WeightList({ slices, className }: WeightListProps) {
  return (
    <ul className={cn("flex flex-col gap-4", className)} data-slot="weight-list">
      {slices.map((slice, index) => (
        <li key={slice.coinId} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className={cn("size-2.5 shrink-0 rounded-full", seriesColorClass(index))}
                aria-hidden="true"
              />
              <span className="truncate font-medium text-foreground">{slice.symbol}</span>
            </span>
            <span className="type-num shrink-0 text-muted-foreground">
              {formatPercentShare(slice.weightPct)}
            </span>
          </div>
          <Progress
            value={slice.weightPct}
            aria-label={weightAriaLabel(slice.name)}
            aria-valuetext={formatPercentShare(slice.weightPct)}
            className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <ProgressIndicator
              initial={{ x: "-100%" }}
              transition={weightBarTransition(index)}
              className={cn("h-full w-full rounded-full", seriesColorClass(index))}
            />
          </Progress>
        </li>
      ))}
    </ul>
  );
}
