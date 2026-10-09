import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { formatPercent } from "@/application/shared/presentation/format";
import type { ChangeBar } from "@/domain/markets/charts";
import { cn } from "@/lib/utils";
import { Bar } from "@/ui/charts/bar";
import { BarChart } from "@/ui/charts/bar-chart";
import { BarEndLabels, type BarEndLabel } from "@/ui/charts/bar-end-labels";
import { DOWN_KEY, UP_KEY, describeBarRows, toUpDownRows } from "@/ui/charts/up-down-bars";
import { ChangeBarLabel } from "@/ui/pages/markets/charts/change-bar-label";

/** Cuántas monedas de la lista se dibujan: más no caben legibles en el alto fijo. */
export const CHANGE_BARS_LIMIT = 10;

/** Subida y bajada: los mismos tokens que el cambio de cada fila (bajada en naranja). */
const UP_COLOR = "hsl(var(--success))";
const DOWN_COLOR = "hsl(var(--warning))";
/** A la izquierda cabe el símbolo; a la derecha, el valor escrito («-12.45 %»). */
const MARGIN = { top: 0, right: 76, bottom: 0, left: 48 };
/** Campo de cada fila que hace de categoría (una barra por moneda). */
const CATEGORY_KEY = "id";

/** Lo que esta pantalla añade a cada fila de barras. */
interface ChangeBarFields {
  id: string;
  symbol: string;
  name: string;
  /** El cambio ya escrito, con su signo: «-1.20 %». */
  text: string;
  rising: boolean;
  /** `BarChart` pide las filas como registro abierto. */
  [key: string]: unknown;
}

const toFields = (bar: ChangeBar): ChangeBarFields => ({
  id: bar.id,
  symbol: bar.symbol,
  name: bar.name,
  text: formatPercent(bar.change24h),
  rising: bar.rising,
});

/** Bklit devuelve cada fila como registro sin tipo: se comprueba antes de leerla. */
function readEndLabel(row: Record<string, unknown>): BarEndLabel | null {
  const { id, symbol, text, rising } = row;
  if (typeof id !== "string" || typeof symbol !== "string" || typeof text !== "string" || typeof rising !== "boolean") {
    return null;
  }
  return { key: id, start: symbol, end: <ChangeBarLabel text={text} rising={rising} /> };
}

export interface ChangeBarsChartProps {
  /** Barras ya recortadas a las que se dibujan, en el orden de la lista. */
  bars: readonly ChangeBar[];
  title: string;
  className?: string;
}

/**
 * Barras horizontales de Bklit con el cambio en 24 h. Bklit no dibuja negativos:
 * el largo es el tamaño del cambio y el sentido lo dan color, flecha y signo,
 * escritos al lado de cada barra (también sirve en táctil, donde no hay tooltip).
 */
export function ChangeBarsChart({ bars, title, className }: ChangeBarsChartProps) {
  const reducedMotion = useReducedMotion() === true;
  // Quién sube lo decide el dominio (`rising`: el 0 exacto cuenta como subida), no el signo.
  const rows = useMemo(
    () =>
      toUpDownRows(
        bars,
        (bar) => bar.change24h,
        toFields,
        (bar) => bar.rising,
      ),
    [bars],
  );

  return (
    <div
      role="img"
      aria-label={describeBarRows(title, rows, (row) => `${row.name} ${row.text}`)}
      data-slot="markets-change-bars"
      className={cn("h-72 w-full min-w-0 touch-none", className)}
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
        <BarEndLabels getLabel={readEndLabel} startClassName="uppercase" />
      </BarChart>
    </div>
  );
}
