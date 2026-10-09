import { motion } from "motion/react";
import { DISTRIBUTION_TOTAL_LABEL } from "@/application/portfolio-screen/messages";
import { formatCurrency } from "@/application/shared/presentation/format";
import { usePie } from "@/ui/charts/pie-context";

/** Aire entre el texto y el borde interior del anillo, en px. */
const INNER_PADDING = 16;

export interface DistributionCenterProps {
  /** Etiqueta cuando no hay ninguna porción señalada. */
  totalLabel?: string;
}

/**
 * Centro del donut: el total y, al señalar una porción, su nombre y su valor
 * (lo que antes decía el tooltip). Sustituye a `PieCenter` de Bklit porque
 * aquel escribe las cifras con el idioma del navegador y aquí van con
 * `formatCurrency`, como en el resto de la pantalla. Lee todo de `usePie`.
 * Movimiento (Motion): al cambiar entre el total y una porción, el texto
 * nuevo entra con un fundido de 150 ms (sin salida, para no solapar dos textos).
 */
export function DistributionCenter({ totalLabel = DISTRIBUTION_TOTAL_LABEL }: DistributionCenterProps) {
  const { data, hoveredIndex, totalValue, innerRadius } = usePie();
  const hovered = hoveredIndex === null ? undefined : data[hoveredIndex];

  return (
    <motion.div
      key={hoveredIndex ?? "total"}
      initial={{ opacity: 0.25 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      data-slot="distribution-center"
      className="flex flex-col items-center justify-center gap-0.5 text-center"
      style={{ width: innerRadius * 2 - INNER_PADDING }}
    >
      <span className="max-w-full truncate text-xs text-muted-foreground">
        {hovered ? hovered.label : totalLabel}
      </span>
      <span className="type-num text-base font-semibold text-foreground">
        {formatCurrency(hovered ? hovered.value : totalValue)}
      </span>
    </motion.div>
  );
}

/*
 * `PieChart` reconoce por este nombre lo que va en el centro y lo saca del SVG
 * a una capa HTML encima del anillo. Sin él, este bloque acabaría dentro del SVG.
 */
DistributionCenter.displayName = "PieCenter";
