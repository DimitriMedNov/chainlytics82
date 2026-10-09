"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useChartStable } from "./chart-context";
import { selectEvenlySpacedIndices } from "./x-axis";

export interface LabelXAxisProps {
  /** Campo de cada punto con la etiqueta ya escrita. Por defecto, `date`. */
  labelKey?: string;
  /** Marcas en pantallas anchas; en estrechas se reducen. Por defecto, 5. */
  numTicks?: number;
  /** Marcas cuando el hueco es estrecho. Por defecto, 3. */
  narrowTicks?: number;
  /** Ancho interior (px) por debajo del cual se usan `narrowTicks`. Por defecto, 320. */
  narrowBelow?: number;
  /** Clases extra de cada etiqueta. */
  className?: string;
}

interface AxisTick {
  key: number;
  x: number;
  label: string;
  isLast: boolean;
}

/**
 * Añadido por el proyecto (pieza compartida de gráficas): eje X que escribe
 * la etiqueta que ya trae cada punto (`point.date`, en español) en vez de
 * formatear la fecha. Usa el mismo contexto (`useChartStable`) y la misma
 * selección de marcas que el `XAxis` de Bklit. Va dentro de `LineChart` o
 * `AreaChart`, en lugar de `XAxis`. La última marca se alinea a la derecha
 * para no salirse de la gráfica.
 */
export function LabelXAxis({
  labelKey = "date",
  numTicks = 5,
  narrowTicks = 3,
  narrowBelow = 320,
  className,
}: LabelXAxisProps) {
  const { containerRef, data, xScale, xAccessor, margin, innerWidth } =
    useChartStable();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setContainer(containerRef.current);
  }, [containerRef]);

  const ticks = useMemo<AxisTick[]>(() => {
    const count =
      innerWidth < narrowBelow ? Math.min(narrowTicks, numTicks) : numTicks;
    const seen = new Set<string>();
    const result: AxisTick[] = [];
    for (const index of selectEvenlySpacedIndices(data.length, count)) {
      const point = data[index];
      const label = point?.[labelKey];
      if (!point || typeof label !== "string" || seen.has(label)) {
        continue;
      }
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
  }, [
    data,
    innerWidth,
    labelKey,
    margin.left,
    narrowBelow,
    narrowTicks,
    numTicks,
    xAccessor,
    xScale,
  ]);

  if (!container) {
    return null;
  }

  return createPortal(
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {ticks.map((tick) => (
        <span
          className={cn(
            "type-num absolute bottom-2 whitespace-nowrap text-chart-label text-xs",
            tick.isLast ? "-translate-x-full" : "-translate-x-1/2",
            className
          )}
          key={tick.key}
          // La posición sale de la escala de la gráfica: no hay clase que la exprese.
          style={{ left: tick.x }}
        >
          {tick.label}
        </span>
      ))}
    </div>,
    container
  );
}

LabelXAxis.displayName = "LabelXAxis";

export default LabelXAxis;
