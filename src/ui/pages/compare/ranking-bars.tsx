import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { formatPercent } from "@/application/shared/presentation/format";
import type { RankingBar } from "@/domain/compare/charts";
import { cn } from "@/lib/utils";
import { Bar } from "@/ui/charts/bar";
import { BarChart } from "@/ui/charts/bar-chart";
import { BarYAxis } from "@/ui/charts/bar-y-axis";
import { ChartTooltip } from "@/ui/charts/tooltip";
import { ChartLegend, type ChartLegendItem } from "@/ui/pages/compare/chart-legend";
import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import { ChartTooltipCard } from "@/ui/pages/compare/chart-tooltip-card";
import { RANKING_BARS_HEIGHT } from "@/ui/pages/compare/constants";
import { BAR_KEYS, barGapFor, barsSummary, barTooltip, toBarPoints } from "@/ui/pages/compare/ranking-bars-data";

export interface RankingBarsProps {
  /** De mejor a peor: `label` (símbolo), `value` (%), `colorIndex`, `rises`. */
  bars: RankingBar[];
}

/** Subida en el color de éxito y bajada en el de aviso (naranja), como en la lista de abajo. */
const RISE_COLOR = "hsl(var(--success))";
const FALL_COLOR = "hsl(var(--warning))";
const MARGIN = { top: 0, right: 16, bottom: 0, left: 56 };
const LEGEND: ChartLegendItem[] = [
  { id: BAR_KEYS.rises, label: COMPARE_TEXTS.chart.rises, dotClassName: "bg-success" },
  { id: BAR_KEYS.falls, label: COMPARE_TEXTS.chart.falls, dotClassName: "bg-warning" },
];
/**
 * Bklit solo redondea la última serie de un apilado salvo que haya separación entre
 * tramos. Aquí cada barra tiene un único tramo, así que medio píxel basta para que
 * las dos series salgan con las mismas esquinas.
 */
const STACK_GAP = 0.5;

/**
 * Barras horizontales de Bklit: cuánto ha variado cada moneda en el periodo.
 * Solo se monta con `ranking.status === "ready"`; el resto de estados son del panel.
 */
export function RankingBars({ bars }: RankingBarsProps) {
  const data = useMemo(() => toBarPoints(bars), [bars]);
  const animate = !useReducedMotion();

  return (
    <div
      role="img"
      aria-label={COMPARE_TEXTS.ranking.barsLabel(barsSummary(bars))}
      data-slot="ranking-bars"
      className="flex w-full min-w-0 flex-col gap-2"
    >
      <BarChart
        data={data}
        xDataKey={BAR_KEYS.label}
        orientation="horizontal"
        stacked
        margin={MARGIN}
        aspectRatio="auto"
        barGap={barGapFor(bars.length)}
        className={cn(RANKING_BARS_HEIGHT)}
      >
        <BarYAxis />
        <Bar dataKey={BAR_KEYS.rises} fill={RISE_COLOR} lineCap={4} stackGap={STACK_GAP} animate={animate} />
        <Bar dataKey={BAR_KEYS.falls} fill={FALL_COLOR} lineCap={4} stackGap={STACK_GAP} animate={animate} />
        <ChartTooltip
          showCrosshair={false}
          showDots={false}
          content={({ point }) => {
            const bar = barTooltip(point);
            if (!bar) return null;
            return (
              <ChartTooltipCard
                title={bar.label}
                rows={[
                  {
                    id: bar.label,
                    label: bar.value >= 0 ? COMPARE_TEXTS.chart.rises : COMPARE_TEXTS.chart.falls,
                    value: formatPercent(bar.value),
                    dotClassName: bar.value >= 0 ? "bg-success" : "bg-warning",
                  },
                ]}
              />
            );
          }}
        />
      </BarChart>
      <ChartLegend items={LEGEND} />
    </div>
  );
}
