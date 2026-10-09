import { motion } from "motion/react";
import { MARKETS_TEXTS } from "@/application/markets/presentation/texts";
import { useRingHover, useRingStable } from "@/ui/charts/ring-context";
import { FADE_IN } from "@/ui/pages/markets/motion/presets";

/** Aire entre el texto y el borde interior del anillo, en px. */
const INNER_PADDING = 16;

/**
 * Centro del anillo: cuántas monedas hay en la lista y, al señalar un anillo,
 * cuántas tiene esa tendencia. Sustituye al `RingCenter` de Bklit, que escribe
 * las cifras con el idioma del navegador y con una animación propia. Al cambiar
 * de lectura, el texto nuevo entra con un fundido (solo opacidad).
 */
export function TrendRingCenter() {
  const { data, baseInnerRadius } = useRingStable();
  const { hoveredIndex } = useRingHover();
  const hovered = hoveredIndex === null ? undefined : data[hoveredIndex];
  const total = data[0]?.maxValue ?? 0;

  return (
    <div
      data-slot="markets-trend-center"
      aria-hidden="true"
      className="flex flex-col items-center justify-center text-center"
      // El hueco lo calcula Bklit al escalar el anillo: no hay clase que lo exprese.
      style={{ width: baseInnerRadius * 2 - INNER_PADDING }}
    >
      {/* Al cambiar la clave, React quita lo anterior al instante y lo nuevo se funde en el mismo hueco. */}
      <motion.div
        key={hovered ? hovered.label : "total"}
        className="flex max-w-full flex-col items-center"
        {...FADE_IN}
      >
        <span className="type-num text-xl font-semibold text-foreground">{hovered ? hovered.value : total}</span>
        <span className="max-w-full truncate text-xs text-muted-foreground">
          {hovered ? hovered.label : MARKETS_TEXTS.trendCenterLabel}
        </span>
      </motion.div>
    </div>
  );
}

/* `RingChart` reconoce por este nombre lo que va en el centro y lo saca del SVG a una capa HTML. */
TrendRingCenter.displayName = "RingCenter";
