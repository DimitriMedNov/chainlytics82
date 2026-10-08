import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useChartStable } from "@/ui/charts/chart-context";
import { selectEvenlySpacedIndices } from "@/ui/charts/x-axis";

export interface ComparisonXAxisProps {
  /** Etiqueta de un punto (la fecha corta que ya trae la fila, en español). */
  labelOf: (point: Record<string, unknown>) => string;
}

/** Por debajo de este ancho de trazado caben 3 marcas; por encima, 5. */
const NARROW_PLOT_PX = 320;

/**
 * Eje X de la comparación. El `XAxis` de Bklit escribe las fechas en inglés y no deja
 * cambiarlo, así que este usa su contexto (`useChartStable`) y pinta las etiquetas del
 * proyecto en las mismas posiciones: pegadas a puntos reales y repartidas por igual.
 */
export function ComparisonXAxis({ labelOf }: ComparisonXAxisProps) {
  const { containerRef, data, xScale, xAccessor, margin, innerWidth } = useChartStable();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // El portal necesita el contenedor ya montado (mismo patrón que los ejes de Bklit).
  useEffect(() => {
    setContainer(containerRef.current);
  }, [containerRef]);

  if (!container) return null;

  const wanted = innerWidth < NARROW_PLOT_PX ? 3 : 5;
  const seen = new Set<string>();
  const ticks = selectEvenlySpacedIndices(data.length, wanted).flatMap((index) => {
    const point = data[index];
    const label = point ? labelOf(point) : "";
    if (!point || !label || seen.has(label)) return [];
    seen.add(label);
    return [{ label, left: (xScale(xAccessor(point)) ?? 0) + margin.left, isLast: index === data.length - 1 }];
  });

  return createPortal(
    <div data-slot="comparison-x-axis" className="pointer-events-none absolute inset-x-0 bottom-0 h-4">
      {ticks.map((tick) => (
        <span
          key={tick.label}
          // La última se alinea por su final para no salirse de la gráfica en móvil.
          className={cn("absolute top-0 flex w-0", tick.isLast ? "justify-end" : "justify-center")}
          style={{ left: tick.left }}
        >
          <span className="whitespace-nowrap text-xs leading-4 text-chart-label">{tick.label}</span>
        </span>
      ))}
    </div>,
    container,
  );
}
