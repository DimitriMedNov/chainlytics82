import { useCallback, useMemo } from "react";
import { curveMonotoneX } from "@visx/curve";
import { useReducedMotion } from "motion/react";
import type { LabeledPricePoint } from "@/application/market/presentation/pricePointLabels";
import { formatAxisPrice, formatCurrency } from "@/application/shared/presentation/format";
import type { PriceSeriesSummary } from "@/domain/coin-detail/priceSeries";
import { cn } from "@/lib/utils";
import { Grid } from "@/ui/charts/grid";
import { Line, LineChart } from "@/ui/charts/line-chart";
import { ChartTooltip } from "@/ui/charts/tooltip";
import { YAxis } from "@/ui/charts/y-axis";
import { PriceChartXAxis } from "@/ui/coin-detail/PriceChartXAxis";
import {
  PRICE_CHART_X_KEY,
  PRICE_CHART_Y_KEY,
  describePriceSeries,
  priceAxisBase,
  readPriceTooltip,
  toPriceChartRows,
} from "@/ui/coin-detail/priceChartRows";

export interface PriceChartProps {
  /** Serie ya etiquetada: `price` en Y, `date` en X, `fullDate` en el tooltip. */
  points: LabeledPricePoint[];
  /** `axisDomain` para el eje Y (no arranca en cero); `null` solo sin puntos. */
  summary: PriceSeriesSummary | null;
  /** Nombre de la moneda, para el texto alternativo de la gráfica. */
  coinName: string;
  className?: string;
}

/** Hueco para las marcas: a la izquierda caben cifras como «$0.5234». */
const MARGIN = { top: 12, right: 16, bottom: 32, left: 60 };
const SERIES_COLOR = "var(--bklit-chart-1)";

function PriceTooltip({ point }: { point: Record<string, unknown> }) {
  const data = readPriceTooltip(point);
  if (!data) return null;
  return (
    <div data-slot="price-chart-tooltip" className="flex flex-col gap-0.5 px-3 py-2">
      <span className="whitespace-nowrap text-xs text-chart-tooltip-muted">{data.fullDate}</span>
      <span className="type-num text-sm font-medium text-chart-tooltip-foreground">
        {formatCurrency(data.price)}
      </span>
    </div>
  );
}

/**
 * Gráfica de línea del precio (Bklit `LineChart`). Solo se monta en el estado
 * «éxito»; cargando, vacío y error los resuelve `CoinPriceChartSection`.
 * Tooltip: fecha completa + precio (función 25 del inventario).
 */
export function PriceChart({ points, summary, coinName, className }: PriceChartProps) {
  const reducedMotion = useReducedMotion();
  const base = priceAxisBase(summary);
  const rows = useMemo(() => toPriceChartRows(points, base), [points, base]);
  const formatTick = useCallback((plotted: number) => formatAxisPrice(plotted + base), [base]);

  return (
    <div
      role="img"
      aria-label={describePriceSeries(coinName, summary)}
      data-slot="price-chart"
      data-points={points.length}
      data-trend={summary?.trend}
      className={cn("h-64 w-full min-w-0", className)}
    >
      <LineChart
        data={rows}
        xDataKey={PRICE_CHART_X_KEY}
        margin={MARGIN}
        aspectRatio=""
        className="h-full"
        animationDuration={reducedMotion ? 0 : undefined}
      >
        <Grid horizontal numTicksRows={4} />
        <YAxis numTicks={4} formatValue={formatTick} />
        <PriceChartXAxis />
        <Line
          dataKey={PRICE_CHART_Y_KEY}
          stroke={SERIES_COLOR}
          strokeWidth={2}
          curve={curveMonotoneX}
          fadeEdges={false}
          animate={!reducedMotion}
        />
        <ChartTooltip
          showDatePill={false}
          dotColor={SERIES_COLOR}
          content={({ point }) => <PriceTooltip point={point} />}
        />
      </LineChart>
    </div>
  );
}
