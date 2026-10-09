import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useChartStable } from "@/ui/charts/chart-context";
import { readRateBar, type RateBarLabel } from "@/ui/pages/converter/rate-change-rows";
import { PriceChange } from "@/ui/shared";

interface BandLabel extends RateBarLabel {
  top: number;
}

/**
 * Etiquetas de cada barra: el código a la izquierda y el cambio escrito a la
 * derecha (flecha + signo + color), porque las barras de Bklit no dibujan
 * negativos ni sacan tooltip en táctil. Se colocan con la escala de la gráfica.
 */
export function RateBarLabels() {
  const { containerRef, data, barScale, bandWidth, barXAccessor, margin } = useChartStable();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setContainer(containerRef.current);
  }, [containerRef]);

  const labels = useMemo<BandLabel[]>(() => {
    if (!barScale || !barXAccessor) return [];
    const result: BandLabel[] = [];
    for (const row of data) {
      const label = readRateBar(row);
      if (label) result.push({ ...label, top: (barScale(barXAccessor(row)) ?? 0) + margin.top });
    }
    return result;
  }, [barScale, barXAccessor, data, margin.top]);

  if (!container || !bandWidth) return null;

  return createPortal(
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {labels.map((label) => (
        <div
          key={label.code}
          // La posición sale de la escala de la gráfica: no hay clase que la exprese.
          style={{ top: label.top, height: bandWidth }}
          className="absolute inset-x-0 flex items-center justify-between"
        >
          <span style={{ width: margin.left }} className="truncate pr-2 text-xs font-medium text-chart-label">
            {label.code}
          </span>
          <span style={{ width: margin.right }} className="flex justify-end pl-2">
            <PriceChange value={label.change24h} label={label.text} />
          </span>
        </div>
      ))}
    </div>,
    container,
  );
}

RateBarLabels.displayName = "RateBarLabels";
