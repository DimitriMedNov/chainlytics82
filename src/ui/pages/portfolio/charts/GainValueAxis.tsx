import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useChart } from "@/ui/charts/chart-context";
import type { GainBar } from "@/ui/pages/portfolio/charts/gainBars";

/** Espera, en segundos, a que la barra de Bklit haya crecido casi del todo. */
const VALUE_DELAY_S = 0.45;

export interface GainValueAxisProps {
  /** Las mismas filas que recibe la gráfica, en el mismo orden. */
  bars: GainBar[];
  /** Separación entre el final de la zona de barras y el texto, en px. */
  offset?: number;
}

/**
 * Columna de importes a la derecha de las barras: el signo va escrito, así que
 * subir o bajar no depende solo del color. Se coloca con las escalas de la
 * gráfica (`useChart` de Bklit); va dentro de `BarChart`.
 * Movimiento (Motion): cada importe aparece con un fundido cuando su barra ya
 * ha crecido; con «reducir movimiento» (barras sin animar) sale a la vez que ellas.
 */
export function GainValueAxis({ bars, offset = 8 }: GainValueAxisProps) {
  const { barScale, bandWidth, innerWidth } = useChart();
  const reduceMotion = useReducedMotion() === true;
  if (!barScale || !bandWidth) return null;

  return (
    <g data-slot="gain-value-axis" pointerEvents="none">
      {bars.map((bar, index) => (
        <motion.text
          key={bar.coinId}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: VALUE_DELAY_S + Math.min(index, 8) * 0.05 }}
          x={innerWidth + offset}
          y={(barScale(bar.symbol) ?? 0) + bandWidth / 2}
          dominantBaseline="central"
          className={cn(
            "type-num text-xs",
            !bar.gain.known && "fill-muted-foreground",
            bar.gain.known && bar.gain.rises && "fill-success",
            bar.gain.known && !bar.gain.rises && "fill-warning",
          )}
        >
          {bar.text}
        </motion.text>
      ))}
    </g>
  );
}
