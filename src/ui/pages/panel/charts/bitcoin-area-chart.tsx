import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import type { LabeledPricePoint } from "@/application/market/presentation/pricePointLabels";
import { formatCurrency } from "@/application/shared/presentation/format";
import type { AxisDomain } from "@/domain/panel/bitcoinChart";
import { Area, AreaChart } from "@/ui/charts/area-chart";
import { Grid } from "@/ui/charts/grid";
import { ChartTooltip } from "@/ui/charts/tooltip";
import {
  BITCOIN_AREA_X_KEY,
  BITCOIN_AREA_Y_KEY,
  describeBitcoinSeries,
  readBitcoinTooltip,
  toBitcoinAreaRows,
  toChartDomain,
} from "@/ui/pages/panel/charts/bitcoin-area-rows";
import { DateLabelAxis } from "@/ui/pages/panel/charts/date-label-axis";
import { PriceYAxis } from "@/ui/pages/panel/charts/price-y-axis";

export interface BitcoinAreaChartProps {
  /** Serie del precio: `date` es la etiqueta del eje X y `fullDate` la fecha del tooltip. */
  points: readonly LabeledPricePoint[];
  /** Dominio del eje Y, tal cual llega de `useBitcoinHistory`. */
  yDomain: AxisDomain | null;
}

/** Hueco para las marcas: a la izquierda caben cifras como «$120 K». */
const MARGIN = { top: 12, right: 16, bottom: 32, left: 52 };
const SERIES_COLOR = "var(--bklit-chart-1)";

function BitcoinTooltip({ point }: { point: Record<string, unknown> }) {
  const data = readBitcoinTooltip(point);
  if (!data) return null;
  return (
    <div data-slot="bitcoin-chart-tooltip" className="flex flex-col gap-0.5 px-3 py-2">
      <span className="whitespace-nowrap text-xs text-chart-tooltip-muted">{data.fullDate}</span>
      <span className="type-num text-sm font-medium text-chart-tooltip-foreground">
        {formatCurrency(data.price)}
      </span>
    </div>
  );
}

/**
 * Gráfica de área del precio de Bitcoin (Bklit `AreaChart`, función 11).
 * Tooltip: fecha completa + precio. Solo se monta en el estado de éxito;
 * cargando, vacío y error los resuelve `BitcoinHistoryPanel`. El alto (`h-80`)
 * coincide con el del esqueleto.
 */
export function BitcoinAreaChart({ points, yDomain }: BitcoinAreaChartProps) {
  const reducedMotion = useReducedMotion();
  const rows = useMemo(() => toBitcoinAreaRows(points), [points]);
  const chartDomain = useMemo(() => toChartDomain(yDomain), [yDomain]);
  const label = useMemo(() => describeBitcoinSeries(points), [points]);

  return (
    <div
      role="img"
      aria-label={label}
      data-slot="bitcoin-area-chart"
      data-points={points.length}
      className="h-80 w-full min-w-0"
    >
      <AreaChart
        data={rows}
        xDataKey={BITCOIN_AREA_X_KEY}
        margin={MARGIN}
        yDomain={chartDomain}
        aspectRatio=""
        className="h-full"
        animationDuration={reducedMotion ? 0 : undefined}
      >
        <Grid horizontal numTicksRows={4} />
        <PriceYAxis fitToRange={chartDomain !== undefined} numTicks={4} />
        <DateLabelAxis />
        <Area
          dataKey={BITCOIN_AREA_Y_KEY}
          fill={SERIES_COLOR}
          stroke={SERIES_COLOR}
          strokeWidth={2}
          fillOpacity={0.3}
          fadeEdges={false}
          animate={!reducedMotion}
        />
        <ChartTooltip
          showDatePill={false}
          dotColor={SERIES_COLOR}
          content={({ point }) => <BitcoinTooltip point={point} />}
        />
      </AreaChart>
    </div>
  );
}
