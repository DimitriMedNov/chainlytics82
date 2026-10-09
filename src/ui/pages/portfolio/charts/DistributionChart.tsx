import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { DISTRIBUTION_CHART_ARIA_LABEL } from "@/application/portfolio-screen/messages";
import { formatCurrency } from "@/application/shared/presentation/format";
import type { DistributionSlice } from "@/domain/portfolio-screen/series";
import { cn } from "@/lib/utils";
import { PieChart } from "@/ui/charts/pie-chart";
import type { PieData } from "@/ui/charts/pie-context";
import { PieSlice } from "@/ui/charts/pie-slice";
import { DistributionCenter } from "@/ui/pages/portfolio/charts/DistributionCenter";
import { seriesColorVar } from "@/ui/pages/portfolio/seriesColors";

/** Radio del hueco, en px, para el alto fijo `h-64` del contenedor. */
const INNER_RADIUS = 80;
/** Separación entre porciones, en radianes: distingue dos vecinas del mismo color. */
const PAD_ANGLE = 0.02;

export interface DistributionChartProps {
  /** `screen.distribution`. Color de cada porción: `seriesColorVar(index)`. */
  slices: DistributionSlice[];
  className?: string;
}

/** Una porción por posición, con el color de su índice (el mismo que su barra de peso). */
function toPieData(slices: DistributionSlice[]): PieData[] {
  return slices.map((slice, index) => ({
    label: slice.name,
    value: slice.value,
    color: seriesColorVar(index),
  }));
}

/**
 * Donut «Distribución» (función 25) con Bklit: una porción por `slice.value`;
 * al señalarla, el centro dice `slice.name` y `formatCurrency(slice.value)`.
 * El contenedor, el título y los estados de pantalla están en `DistributionSection`.
 */
export function DistributionChart({ slices, className }: DistributionChartProps) {
  const reduceMotion = useReducedMotion() === true;
  const data = useMemo(() => toPieData(slices), [slices]);

  return (
    <div
      data-slot="distribution-chart"
      className={cn("flex h-64 w-full items-center justify-center", className)}
    >
      <div
        role="img"
        aria-label={DISTRIBUTION_CHART_ARIA_LABEL}
        className="aspect-square h-full max-w-full"
      >
        <PieChart data={data} innerRadius={INNER_RADIUS} padAngle={PAD_ANGLE} cornerRadius={4} className="size-full">
          {slices.map((slice, index) => (
            <PieSlice
              key={slice.coinId}
              index={index}
              animate={!reduceMotion}
              hoverEffect={reduceMotion ? "none" : "translate"}
            />
          ))}
          <DistributionCenter />
        </PieChart>
      </div>
      <ul className="sr-only">
        {slices.map((slice) => (
          <li key={slice.coinId}>
            {slice.name}: {formatCurrency(slice.value)}
          </li>
        ))}
      </ul>
    </div>
  );
}
