import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useChartStable } from "@/ui/charts/chart-context";
import { readBarLabel, type BarLabelData } from "@/ui/pages/panel/charts/top-bars-rows";
import { TrendLabel } from "@/ui/pages/panel/trend-label";

interface BandLabel extends BarLabelData {
  top: number;
}

/**
 * Etiquetas de cada barra horizontal: el símbolo a la izquierda y el valor ya
 * escrito a la derecha (con flecha y signo si la fila dice si sube o baja).
 * El `BarYAxis` de Bklit solo escribe la categoría; este usa el mismo contexto
 * (`useChartStable`) para colocar las dos etiquetas en los márgenes.
 */
export function BarEndLabels() {
  const { containerRef, data, barScale, bandWidth, barXAccessor, margin } = useChartStable();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setContainer(containerRef.current);
  }, [containerRef]);

  const labels = useMemo<BandLabel[]>(() => {
    if (!barScale || !barXAccessor) return [];
    const result: BandLabel[] = [];
    for (const row of data) {
      const label = readBarLabel(row);
      if (label) result.push({ ...label, top: (barScale(barXAccessor(row)) ?? 0) + margin.top });
    }
    return result;
  }, [barScale, barXAccessor, data, margin.top]);

  if (!container || !bandWidth) return null;

  return createPortal(
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {labels.map((label) => (
        <div
          key={label.id}
          // La posición sale de la escala de la gráfica: no hay clase que la exprese.
          style={{ top: label.top, height: bandWidth }}
          className="absolute inset-x-0 flex items-center justify-between"
        >
          <span
            style={{ width: margin.left }}
            className="truncate pr-2 text-xs font-medium uppercase text-chart-label"
          >
            {label.symbol}
          </span>
          <span style={{ width: margin.right }} className="flex justify-end pl-2">
            {label.rising === null ? (
              <span className="type-num whitespace-nowrap text-xs font-medium text-foreground">{label.text}</span>
            ) : (
              <TrendLabel text={label.text} rising={label.rising} />
            )}
          </span>
        </div>
      ))}
    </div>,
    container,
  );
}

BarEndLabels.displayName = "BarEndLabels";
