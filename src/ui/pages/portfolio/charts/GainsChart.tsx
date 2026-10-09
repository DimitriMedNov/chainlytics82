import { useMemo } from "react";
import { CircleDollarSign } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { GAINS_CHART_ARIA_LABEL, GAINS_EMPTY_DESCRIPTION, GAINS_EMPTY_TITLE } from "@/application/portfolio-screen/messages";
import type { PositionGainPoint } from "@/domain/portfolio-screen/series";
import { cn } from "@/lib/utils";
import { Bar } from "@/ui/charts/bar";
import { BarChart } from "@/ui/charts/bar-chart";
import { BarYAxis } from "@/ui/charts/bar-y-axis";
import { EmptyState } from "@/ui/shared";
import { GainValueAxis } from "@/ui/pages/portfolio/charts/GainValueAxis";
import {
  CATEGORY_KEY,
  FALLS_KEY,
  RISES_KEY,
  chartHeight,
  hasKnownGain,
  toBarRows,
  toGainBars,
} from "@/ui/pages/portfolio/charts/gainBars";

/** Hueco para el símbolo (izquierda) y para el importe con signo (derecha). */
const MARGIN = { top: 4, right: 96, bottom: 4, left: 52 };

export interface GainsChartProps {
  /**
   * `screen.gains`, una entrada por posición. `unrealizedPnl === null` es
   * «sin coste»: esa barra no se pinta (no es un cero).
   */
  points: PositionGainPoint[];
  className?: string;
}

/**
 * Ganancia sobre el papel de cada posición, en barras horizontales de Bklit.
 * La barra mide el tamaño; el color (`--success` sube, `--warning` baja) y el
 * signo del importe dicen el sentido. Carga, error y vacío de pantalla los pone
 * `PortfolioContent`; aquí solo queda el vacío propio: ninguna posición con coste.
 */
export function GainsChart({ points, className }: GainsChartProps) {
  const reduceMotion = useReducedMotion() === true;
  const bars = useMemo(() => toGainBars(points), [points]);
  const rows = useMemo(() => toBarRows(bars), [bars]);

  if (!hasKnownGain(bars)) {
    return (
      <EmptyState
        size="sm"
        framed={false}
        headingLevel="h3"
        icon={CircleDollarSign}
        title={GAINS_EMPTY_TITLE}
        description={GAINS_EMPTY_DESCRIPTION}
        className={cn("min-h-64", className)}
      />
    );
  }

  return (
    <div data-slot="gains-chart" className={cn("min-h-64 w-full", className)}>
      <div
        role="img"
        aria-label={GAINS_CHART_ARIA_LABEL}
        style={{ height: chartHeight(bars.length) }}
      >
        <BarChart
          data={rows}
          xDataKey={CATEGORY_KEY}
          orientation="horizontal"
          stacked
          aspectRatio="auto"
          className="h-full"
          margin={MARGIN}
          barGap={0.4}
        >
          <Bar dataKey={RISES_KEY} fill="hsl(var(--success))" lineCap="butt" animate={!reduceMotion} />
          <Bar dataKey={FALLS_KEY} fill="hsl(var(--warning))" lineCap="butt" animate={!reduceMotion} />
          <BarYAxis />
          <GainValueAxis bars={bars} />
        </BarChart>
      </div>
      <ul className="sr-only">
        {bars.map((bar) => (
          <li key={bar.coinId}>
            {bar.name}: {bar.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
