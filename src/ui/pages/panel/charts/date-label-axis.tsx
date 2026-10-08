import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useChartStable } from "@/ui/charts/chart-context";
import { selectEvenlySpacedIndices } from "@/ui/charts/x-axis";

export interface DateLabelAxisProps {
  /** Campo de cada punto con la etiqueta ya escrita. Por defecto, `date`. */
  labelKey?: string;
  /** Marcas en pantallas anchas; en estrechas se reducen. Por defecto, 5. */
  numTicks?: number;
}

/** Ancho interior por debajo del cual solo caben tres etiquetas sin pisarse. */
const NARROW_INNER_WIDTH = 320;

interface AxisTick {
  key: number;
  x: number;
  label: string;
  isLast: boolean;
}

/**
 * Eje X con las etiquetas que ya trae la serie (`point.date`, en español).
 * El `XAxis` de Bklit escribe sus propias fechas en inglés y no admite
 * etiquetas; este usa el mismo contexto (`useChartStable`) y su misma
 * selección de marcas.
 */
export function DateLabelAxis({ labelKey = "date", numTicks = 5 }: DateLabelAxisProps) {
  const { containerRef, data, xScale, xAccessor, margin, innerWidth } = useChartStable();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setContainer(containerRef.current);
  }, [containerRef]);

  const ticks = useMemo<AxisTick[]>(() => {
    const count = innerWidth < NARROW_INNER_WIDTH ? Math.min(3, numTicks) : numTicks;
    const seen = new Set<string>();
    const result: AxisTick[] = [];
    for (const index of selectEvenlySpacedIndices(data.length, count)) {
      const point = data[index];
      const label = point?.[labelKey];
      if (!point || typeof label !== "string" || seen.has(label)) continue;
      seen.add(label);
      const date = xAccessor(point);
      result.push({
        key: date.getTime(),
        x: (xScale(date) ?? 0) + margin.left,
        label,
        isLast: index === data.length - 1,
      });
    }
    return result;
  }, [data, innerWidth, labelKey, margin.left, numTicks, xAccessor, xScale]);

  if (!container) return null;

  return createPortal(
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {ticks.map((tick) => (
        <span
          key={tick.key}
          // La posición sale de la escala de la gráfica: no hay clase que la exprese.
          style={{ left: tick.x }}
          className={cn(
            "type-num absolute bottom-2 whitespace-nowrap text-xs text-chart-label",
            tick.isLast ? "-translate-x-full" : "-translate-x-1/2",
          )}
        >
          {tick.label}
        </span>
      ))}
    </div>,
    container,
  );
}

DateLabelAxis.displayName = "DateLabelAxis";
