import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { CONVERTER_TEXTS } from "@/application/converter/presentation/texts";
import type { RateChangeBar } from "@/domain/converter/quick";
import { Bar } from "@/ui/charts/bar";
import { BarChart } from "@/ui/charts/bar-chart";
import { ChartTooltip } from "@/ui/charts/tooltip";
import { RateBarLabels } from "@/ui/pages/converter/rate-bar-labels";
import {
  RATE_CATEGORY_KEY,
  RATE_DOWN_KEY,
  RATE_UP_KEY,
  describeRateBars,
  readRateBar,
  toRateBarRows,
} from "@/ui/pages/converter/rate-change-rows";

/** Sube y baja: los mismos tokens que la variación de la lista (baja en naranja). */
const UP_COLOR = "hsl(var(--success))";
const DOWN_COLOR = "hsl(var(--warning))";
/** A la izquierda cabe el código; a la derecha, el valor escrito («-12.45 %»). */
const MARGIN = { top: 0, right: 76, bottom: 0, left: 44 };

export interface RateTooltipProps {
  /** Fila de la barra bajo el puntero, tal como la entrega el tooltip de Bklit. */
  point: Record<string, unknown>;
}

function RateTooltip({ point }: RateTooltipProps) {
  const data = readRateBar(point);
  if (!data) return null;
  return (
    <div data-slot="rate-change-tooltip" className="flex flex-col gap-0.5 px-3 py-2">
      <span className="whitespace-nowrap text-xs text-chart-tooltip-muted">{data.name}</span>
      <span className="type-num whitespace-nowrap text-sm font-medium text-chart-tooltip-foreground">{data.text}</span>
    </div>
  );
}

export interface RateChangeChartProps {
  /** Cambio en 24 h de cada tasa, en el orden de la lista. `direction` da el color. */
  bars: readonly RateChangeBar[];
}

/**
 * Barras horizontales (Bklit) del cambio en 24 h de las tasas: el largo es el
 * tamaño del cambio; color, flecha y signo dicen si sube o baja. Alto: `h-32`.
 */
export function RateChangeChart({ bars }: RateChangeChartProps) {
  const reducedMotion = useReducedMotion();
  const rows = useMemo(() => toRateBarRows(bars), [bars]);

  return (
    <div
      role="img"
      aria-label={describeRateBars(CONVERTER_TEXTS.rates.chartAria, rows)}
      data-slot="rate-change-chart"
      className="h-32 w-full min-w-0 touch-pan-y"
    >
      <BarChart
        data={rows}
        xDataKey={RATE_CATEGORY_KEY}
        orientation="horizontal"
        stacked
        barGap={0.4}
        margin={MARGIN}
        aspectRatio=""
        className="h-full"
        animationDuration={reducedMotion ? 0 : undefined}
      >
        <Bar dataKey={RATE_UP_KEY} fill={UP_COLOR} lineCap="butt" animate={!reducedMotion} />
        <Bar dataKey={RATE_DOWN_KEY} fill={DOWN_COLOR} lineCap="butt" animate={!reducedMotion} />
        <RateBarLabels />
        <ChartTooltip showCrosshair={false} showDatePill={false} content={({ point }) => <RateTooltip point={point} />} />
      </BarChart>
    </div>
  );
}
