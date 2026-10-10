import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { MARKETS_TEXTS, TREND_LABELS, trendSliceText } from "@/application/markets/presentation/texts";
import { formatPercentShare } from "@/application/shared/presentation/format";
import { cn } from "@/lib/utils";
import type { TrendSlice } from "@/domain/markets/charts";
import { Ring } from "@/ui/charts/ring";
import { RingChart } from "@/ui/charts/ring-chart";
import type { RingData } from "@/ui/charts/ring-context";
import { TrendRingCenter } from "@/ui/pages/markets/charts/trend-ring-center";
import { TREND_STYLES } from "@/ui/pages/markets/charts/trend-styles";

export interface TrendRingChartProps {
  /** Los 3 trozos (suben, bajan, sin cambio), siempre en ese orden. */
  slices: readonly TrendSlice[];
}

/**
 * Anillos de Bklit: uno por tendencia, lleno según su parte de la lista. Al
 * lado, la leyenda dice cada cifra con icono y texto (nunca solo color).
 */
export function TrendRingChart({ slices }: TrendRingChartProps) {
  const reducedMotion = useReducedMotion() === true;
  const total = useMemo(() => slices.reduce((sum, slice) => sum + slice.count, 0), [slices]);
  const data = useMemo<RingData[]>(
    () =>
      slices.map((slice) => ({
        label: TREND_LABELS[slice.key],
        value: slice.count,
        maxValue: Math.max(total, 1),
        color: TREND_STYLES[slice.key].color,
      })),
    [slices, total],
  );
  const summary = slices
    .map((slice) => trendSliceText(TREND_LABELS[slice.key], slice.count, formatPercentShare(slice.share)))
    .join("; ");

  return (
    <div data-slot="markets-trend-ring" className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col">
      <div
        role="img"
        aria-label={`${MARKETS_TEXTS.trendTitle}. ${summary}.`}
        // Bklit agranda el anillo señalado y no deja apagarlo: con «reducir movimiento» se anula
        // ese escalado (cada anillo es un `g` hijo del grupo centrado) y queda el atenuado del resto.
        className="aspect-square h-48 max-w-full shrink-0 touch-none motion-reduce:[&_svg>g>g]:transform-none!"
      >
        <RingChart data={data} strokeWidth={12} ringGap={6} baseInnerRadius={52} className="size-full">
          {slices.map((slice, index) => (
            <Ring key={slice.key} index={index} animate={!reducedMotion} showGlow={false} />
          ))}
          <TrendRingCenter />
        </RingChart>
      </div>
      <ul className="flex w-full min-w-0 flex-col gap-2">
        {slices.map((slice) => {
          const { Icon, textClass } = TREND_STYLES[slice.key];
          return (
            <li key={slice.key} className="flex items-center justify-between gap-3 text-sm">
              <span className={cn("inline-flex min-w-0 items-center gap-1.5 font-medium", textClass)}>
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{TREND_LABELS[slice.key]}</span>
              </span>
              <span className="type-num whitespace-nowrap text-foreground">
                {slice.count}
                <span className="ml-2 text-xs text-muted-foreground">{formatPercentShare(slice.share)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
