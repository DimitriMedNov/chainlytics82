import { useMemo, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import type { TopCoinBar, TopCoinChangeBar } from "@/domain/panel/topCoins";
import { Bar } from "@/ui/charts/bar";
import { BarChart } from "@/ui/charts/bar-chart";
import { ChartTooltip } from "@/ui/charts/tooltip";
import { BarEndLabels } from "@/ui/pages/panel/charts/bar-end-labels";
import {
  CHANGE_DOWN_KEY,
  CHANGE_UP_KEY,
  TOP_BAR_CATEGORY_KEY,
  VOLUME_KEY,
  describeBars,
  readBarLabel,
  toChangeBarRows,
  toVolumeBarRows,
  type TopBarRow,
} from "@/ui/pages/panel/charts/top-bars-rows";

/** Subida y bajada: los mismos tokens que la variación de la tabla (bajada en naranja). */
const UP_COLOR = "hsl(var(--success))";
const DOWN_COLOR = "hsl(var(--warning))";
const VOLUME_COLOR = "var(--bklit-chart-2)";
/** A la izquierda cabe el símbolo; a la derecha, el valor escrito («-12.45 %», «$120.5 G»). */
const MARGIN = { top: 0, right: 76, bottom: 0, left: 44 };

function BarTooltip({ point }: { point: Record<string, unknown> }) {
  const data = readBarLabel(point);
  if (!data) return null;
  return (
    <div data-slot="top-bars-tooltip" className="flex flex-col gap-0.5 px-3 py-2">
      <span className="whitespace-nowrap text-xs text-chart-tooltip-muted">{data.name}</span>
      <span className="type-num whitespace-nowrap text-sm font-medium text-chart-tooltip-foreground">
        {data.fullText}
      </span>
    </div>
  );
}

interface TopBarsFrameProps {
  slot: string;
  title: string;
  rows: TopBarRow[];
  /** Las series (`Bar`) de la gráfica. */
  children: ReactNode;
}

/** Marco común de las dos gráficas: barras horizontales de Bklit, etiquetas y tooltip. Alto: `h-40`. */
function TopBarsFrame({ slot, title, rows, children }: TopBarsFrameProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div role="img" aria-label={describeBars(title, rows)} data-slot={slot} className="h-40 w-full min-w-0">
      <BarChart
        data={rows}
        xDataKey={TOP_BAR_CATEGORY_KEY}
        orientation="horizontal"
        stacked
        barGap={0.4}
        margin={MARGIN}
        aspectRatio=""
        className="h-full"
        animationDuration={reducedMotion ? 0 : undefined}
      >
        {children}
        <BarEndLabels />
        <ChartTooltip showCrosshair={false} showDatePill={false} content={({ point }) => <BarTooltip point={point} />} />
      </BarChart>
    </div>
  );
}

export interface TopChangeBarsChartProps {
  /** Cambio en 24 h de cada moneda del top, en %. `rising` da el color. */
  bars: readonly TopCoinChangeBar[];
}

/** Barras del cambio en 24 h del top 5: el largo es el tamaño del cambio; color, flecha y signo dicen si sube o baja. */
export function TopChangeBarsChart({ bars }: TopChangeBarsChartProps) {
  const reducedMotion = useReducedMotion();
  const rows = useMemo(() => toChangeBarRows(bars), [bars]);

  return (
    <TopBarsFrame slot="top-change-bars" title={PANEL_TEXTS.top.columns.change} rows={rows}>
      <Bar dataKey={CHANGE_UP_KEY} fill={UP_COLOR} lineCap="butt" animate={!reducedMotion} />
      <Bar dataKey={CHANGE_DOWN_KEY} fill={DOWN_COLOR} lineCap="butt" animate={!reducedMotion} />
    </TopBarsFrame>
  );
}

export interface TopVolumeBarsChartProps {
  /** Volumen en 24 h de cada moneda del top, en USD. */
  bars: readonly TopCoinBar[];
}

/** Barras del volumen en 24 h del top 5. */
export function TopVolumeBarsChart({ bars }: TopVolumeBarsChartProps) {
  const reducedMotion = useReducedMotion();
  const rows = useMemo(() => toVolumeBarRows(bars), [bars]);

  return (
    <TopBarsFrame slot="top-volume-bars" title={PANEL_TEXTS.top.columns.volume} rows={rows}>
      <Bar dataKey={VOLUME_KEY} fill={VOLUME_COLOR} lineCap="butt" animate={!reducedMotion} />
    </TopBarsFrame>
  );
}
