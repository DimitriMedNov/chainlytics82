import { useMemo } from "react";
import { createAxisPriceFormatter, formatAxisPrice } from "@/application/shared/presentation/format";
import { useYScale } from "@/ui/charts/chart-context";
import { YAxis } from "@/ui/charts/y-axis";

export interface PriceYAxisProps {
  /** `false` solo sin dominio (serie vacía): se escribe con el formato general. */
  fitToRange: boolean;
  /** Marcas que se piden al eje; el formateador se ajusta al mismo número. Por defecto, 4. */
  numTicks?: number;
}

/**
 * Eje Y de precios sin marcas repetidas. Lee el dominio que Bklit usa de
 * verdad (redondea por dentro el `yDomain` que se le pasa, así que no
 * coincide con el del hook) y con él decide los decimales de cada marca: dos
 * marcas distintas nunca se escriben igual.
 */
export function PriceYAxis({ fitToRange, numTicks = 4 }: PriceYAxisProps) {
  const [low, high] = useYScale().domain();
  const formatTick = useMemo(
    () => (fitToRange ? createAxisPriceFormatter([low, high], numTicks) : formatAxisPrice),
    [fitToRange, low, high, numTicks],
  );

  return <YAxis numTicks={numTicks} formatValue={formatTick} />;
}
