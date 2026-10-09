import { useMemo } from "react";
import { createAxisPriceFormatter, formatAxisPrice } from "@/application/shared/presentation/format";
import { useYScale } from "@/ui/charts/chart-context";
import { YAxis } from "@/ui/charts/y-axis";

export interface PriceChartYAxisProps {
  /** `false` solo sin resumen de la serie: se escribe con el formato general. */
  fitToRange: boolean;
  /** Marcas que se le piden al eje; el formateador usa el mismo número. */
  numTicks?: number;
}

/**
 * Eje Y de la gráfica de precio, sin marcas repetidas.
 *
 * El formateador necesita el paso entre marcas para decidir los decimales. Ese
 * paso sale del dominio que Bklit usa DE VERDAD: redondea por dentro el que se
 * le pasa (`summary.axisDomain`) a marcas limpias, así que se lee de su escala
 * (`useYScale`) en vez de suponerlo.
 */
export function PriceChartYAxis({ fitToRange, numTicks = 4 }: PriceChartYAxisProps) {
  const [low, high] = useYScale().domain();

  const formatTick = useMemo(
    () => (fitToRange ? createAxisPriceFormatter([low, high], numTicks) : formatAxisPrice),
    [fitToRange, low, high, numTicks],
  );

  return <YAxis numTicks={numTicks} formatValue={formatTick} />;
}
