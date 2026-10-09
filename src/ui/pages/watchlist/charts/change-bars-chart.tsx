import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import type { Change24hBar } from "@/domain/watchlist-screen/chart";
import { Bar } from "@/ui/charts/bar";
import { BarChart } from "@/ui/charts/bar-chart";
import { BarEndLabels, type BarEndLabel } from "@/ui/charts/bar-end-labels";
import { ChartTooltip } from "@/ui/charts/tooltip";
import { DOWN_KEY, UP_KEY, describeBarRows } from "@/ui/charts/up-down-bars";
import {
  CATEGORY_KEY,
  describeChangeBar,
  readChangeBar,
  toChangeBarRows,
} from "@/ui/pages/watchlist/charts/change-bar-row";
import { WATCHLIST_TEXTS } from "@/application/watchlist-screen/texts";
import { PriceChange, Skeleton } from "@/ui/shared";
import { cn } from "@/lib/utils";

/** Los mismos tokens que el cambio de la fila: sube en verde, baja en naranja. */
const UP_COLOR = "hsl(var(--success))";
const DOWN_COLOR = "hsl(var(--warning))";
/** A la izquierda cabe el símbolo; a la derecha, el cambio escrito («-12.45 %»). */
const MARGIN = { top: 0, right: 76, bottom: 0, left: 48 };
/** Alto reservado por moneda, en px: la gráfica crece con la lista y no salta. */
const ROW_HEIGHT = 32;

/** Símbolo a la izquierda y cambio escrito (flecha y signo) a la derecha de cada barra. */
function changeBarLabel(row: Record<string, unknown>): BarEndLabel | null {
  const data = readChangeBar(row);
  if (!data) return null;
  return {
    key: data.id,
    start: data.symbol,
    end: <PriceChange value={data.change24h} label={data.text} />,
  };
}

function BarTooltip({ point }: { point: Record<string, unknown> }) {
  const data = readChangeBar(point);
  if (!data) return null;
  return (
    <div data-slot="change-bars-tooltip" className="flex flex-col gap-0.5 px-3 py-2">
      <span className="whitespace-nowrap text-xs text-chart-tooltip-muted">{data.name}</span>
      <span className="type-num whitespace-nowrap text-sm font-medium text-chart-tooltip-foreground">
        {data.text}
      </span>
    </div>
  );
}

export interface ChangeBarsChartProps {
  /** Una barra por moneda visible, en el orden de la lista. */
  series: readonly Change24hBar[];
}

/**
 * Barras horizontales del cambio en 24 h. El largo es el tamaño del cambio;
 * el color, la flecha y el signo dicen si sube o baja (nunca solo el color).
 */
export function ChangeBarsChart({ series }: ChangeBarsChartProps) {
  const reducedMotion = useReducedMotion();
  const rows = useMemo(() => toChangeBarRows(series), [series]);

  return (
    <div
      role="img"
      aria-label={describeBarRows(WATCHLIST_TEXTS.chartTitle, rows, describeChangeBar)}
      data-slot="change-bars"
      // El alto depende del número de monedas: no hay clase que lo exprese.
      style={{ height: rows.length * ROW_HEIGHT }}
      className="w-full min-w-0"
    >
      <BarChart
        data={rows}
        xDataKey={CATEGORY_KEY}
        orientation="horizontal"
        stacked
        barGap={0.4}
        margin={MARGIN}
        aspectRatio=""
        className="h-full"
        animationDuration={reducedMotion ? 0 : undefined}
      >
        <Bar dataKey={UP_KEY} fill={UP_COLOR} lineCap="butt" animate={!reducedMotion} />
        <Bar dataKey={DOWN_KEY} fill={DOWN_COLOR} lineCap="butt" animate={!reducedMotion} />
        <BarEndLabels getLabel={changeBarLabel} startClassName="uppercase" />
        <ChartTooltip
          showCrosshair={false}
          showDatePill={false}
          content={({ point }) => <BarTooltip point={point} />}
        />
      </BarChart>
    </div>
  );
}

const SKELETON_BARS = [
  { id: "a", width: "w-3/4" },
  { id: "b", width: "w-1/2" },
  { id: "c", width: "w-2/3" },
  { id: "d", width: "w-1/3" },
] as const;

/** Con la forma de `ChangeBarsChart`: símbolo, barra y valor por fila. */
export function ChangeBarsChartSkeleton() {
  return (
    <div className="flex flex-col">
      {SKELETON_BARS.map((bar) => (
        <div key={bar.id} className="flex h-8 items-center gap-2">
          <Skeleton className="h-3 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <Skeleton className={cn("h-4 rounded-sm", bar.width)} />
          </div>
          <Skeleton className="h-3 w-14 shrink-0" />
        </div>
      ))}
    </div>
  );
}
