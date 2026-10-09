import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useChartStable } from "./chart-context";

export interface BarEndLabel {
  /** Identificador estable de la fila (no el índice). */
  key: string;
  /** Lo que va a la izquierda de la barra, en el margen: símbolo o código. */
  start: ReactNode;
  /** Lo que va a la derecha, en el margen: el valor ya escrito. */
  end: ReactNode;
}

export interface BarEndLabelsProps {
  /**
   * Lee una fila de la gráfica y devuelve sus dos etiquetas, o `null` para no
   * escribir nada en esa fila. Bklit entrega cada fila como registro sin tipo:
   * compruébala antes de leerla. Debe ser estable (función fuera del componente
   * o con `useCallback`): si cambia en cada render, las etiquetas se recalculan.
   */
  getLabel: (row: Record<string, unknown>) => BarEndLabel | null;
  /** Clases de la etiqueta izquierda (p. ej. `uppercase`). */
  startClassName?: string;
  /** Clases de la etiqueta derecha. */
  endClassName?: string;
  className?: string;
}

interface PlacedLabel extends BarEndLabel {
  top: number;
}

/**
 * Añadido por el proyecto (no viene de Bklit): etiquetas en los dos extremos de
 * cada barra HORIZONTAL. Va como hijo de `<BarChart orientation="horizontal">`
 * y usa su contexto para colocarse: la izquierda ocupa `margin.left` y la
 * derecha `margin.right`, así que la gráfica debe reservar esos márgenes.
 *
 * Hace falta porque el `BarYAxis` de Bklit solo escribe la categoría y las
 * barras no dibujan negativos: el valor (con flecha y signo) se escribe al lado.
 * Es decorativo (`aria-hidden`): el texto alternativo va en la gráfica
 * (`describeBarRows`). No trae textos propios: los pone quien lo usa.
 */
export function BarEndLabels({ getLabel, startClassName, endClassName, className }: BarEndLabelsProps) {
  const { containerRef, data, barScale, bandWidth, barXAccessor, margin } = useChartStable();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setContainer(containerRef.current);
  }, [containerRef]);

  const labels = useMemo<PlacedLabel[]>(() => {
    if (!barScale || !barXAccessor) return [];
    const result: PlacedLabel[] = [];
    for (const row of data) {
      const label = getLabel(row);
      if (label) result.push({ ...label, top: (barScale(barXAccessor(row)) ?? 0) + margin.top });
    }
    return result;
  }, [barScale, barXAccessor, data, getLabel, margin.top]);

  if (!container || !bandWidth) return null;

  return createPortal(
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      {labels.map((label) => (
        <div
          key={label.key}
          // La posición sale de la escala de la gráfica: no hay clase que la exprese.
          style={{ top: label.top, height: bandWidth }}
          className="absolute inset-x-0 flex items-center justify-between"
        >
          <span
            style={{ width: margin.left }}
            className={cn("truncate pr-2 text-xs font-medium text-chart-label", startClassName)}
          >
            {label.start}
          </span>
          <span style={{ width: margin.right }} className={cn("flex justify-end pl-2", endClassName)}>
            {label.end}
          </span>
        </div>
      ))}
    </div>,
    container,
  );
}

BarEndLabels.displayName = "BarEndLabels";
