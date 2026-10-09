import { curveMonotoneX } from "@visx/curve";
import { useReducedMotion } from "motion/react";
import { formatChangeAxis } from "@/application/compare/presentation/labels";
import { formatPercent } from "@/application/shared/presentation/format";
import { tooltipEntries } from "@/domain/compare/charts";
import type { RangeDays } from "@/domain/shared/range";
import type { CompareScreen } from "@/hooks/compare/useCompareScreen";
import { cn } from "@/lib/utils";
import { Grid } from "@/ui/charts/grid";
import { Line, LineChart } from "@/ui/charts/line-chart";
import { ChartTooltip } from "@/ui/charts/tooltip";
import { YAxis } from "@/ui/charts/y-axis";
import { ChartLegend } from "@/ui/pages/compare/chart-legend";
import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import { ChartTooltipCard } from "@/ui/pages/compare/chart-tooltip-card";
import { ComparisonXAxis } from "@/ui/pages/compare/comparison-x-axis";
import { COMPARISON_CHART_HEIGHT, seriesBgClass } from "@/ui/pages/compare/constants";
import { COMPARISON_X_KEY, useComparisonChart } from "@/ui/pages/compare/use-comparison-chart";

export interface ComparisonChartProps {
  /** Una fila por instante común: `date` (eje X), `fullDate` (tooltip), `changes[coinId]` en %. */
  rows: CompareScreen["chart"]["rows"];
  /** Una línea por moneda elegida, con su `colorIndex` (token `--chart-N`). */
  series: CompareScreen["chart"]["series"];
  /** Monedas elegidas, para `tooltipEntries(row, coins)`. */
  coins: CompareScreen["chart"]["coins"];
  days: RangeDays;
}

/** Hueco del eje Y («-100 %») a la izquierda y de las fechas abajo. */
const MARGIN = { top: 12, right: 16, bottom: 28, left: 56 };
const ZERO_LINE = [0];

/**
 * Gráfica de líneas de Bklit: una línea por moneda, todas partiendo de 0 %.
 * Solo se monta con `chart.status === "ready"`; el resto de estados son del panel.
 */
export function ComparisonChart({ rows, series, coins }: ComparisonChartProps) {
  const { data, lines, rowOf, summary } = useComparisonChart(rows, series, coins);
  const reducedMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={COMPARE_TEXTS.chart.linesLabel(summary)}
      data-slot="comparison-chart"
      className="flex w-full min-w-0 flex-col gap-2"
    >
      <LineChart
        data={data}
        xDataKey={COMPARISON_X_KEY}
        margin={MARGIN}
        aspectRatio="auto"
        // Bklit no mira `prefers-reduced-motion` en su entrada: con él activo, sin barrido.
        animationDuration={reducedMotion ? 0 : undefined}
        className={cn(COMPARISON_CHART_HEIGHT)}
      >
        {/* Rejilla solo horizontal y el 0 % punteado: por encima gana, por debajo pierde. */}
        <Grid
          horizontal
          vertical={false}
          strokeDasharray="0"
          highlightRowValues={ZERO_LINE}
          highlightRowStrokeDasharray="4,4"
          highlightRowStrokeWidth={1.5}
        />
        <YAxis formatValue={formatChangeAxis} />
        <ComparisonXAxis labelOf={(point) => rowOf(point)?.date ?? ""} />
        {lines.map((line) => (
          <Line
            key={line.coinId}
            dataKey={line.coinId}
            stroke={`var(--bklit-chart-${line.colorIndex})`}
            strokeWidth={2}
            curve={curveMonotoneX}
            fadeEdges={false}
          />
        ))}
        <ChartTooltip
          showDatePill={false}
          content={({ point }) => {
            const row = rowOf(point);
            if (!row) return null;
            return (
              <ChartTooltipCard
                title={row.fullDate}
                rows={tooltipEntries(row, coins).map((entry) => ({
                  id: entry.coinId,
                  label: entry.symbol,
                  value: formatPercent(entry.changePct),
                  dotClassName: seriesBgClass(entry.colorIndex),
                }))}
              />
            );
          }}
        />
      </LineChart>
      <ChartLegend
        items={series.map((line) => ({
          id: line.coinId,
          label: line.symbol,
          dotClassName: seriesBgClass(line.colorIndex),
        }))}
      />
    </div>
  );
}
