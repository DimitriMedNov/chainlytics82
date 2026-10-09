import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { DURATION, EASE_OUT, REFRESH_FROM_OPACITY, type EntranceProps } from "@/ui/pages/markets/motion/presets";
import { priceChangeVariants } from "@/ui/shared";

export interface ChangeBarLabelProps {
  /** Cambio ya escrito, con su signo: «+2.45 %». */
  text: string;
  /** true: flecha arriba y color de subida (el 0 exacto cuenta como subida). */
  rising: boolean;
}

/** Fundido corto cuando el valor se refresca; no anima al montar. Solo opacidad. */
const VALUE_REFRESH: EntranceProps = {
  initial: { opacity: REFRESH_FROM_OPACITY },
  animate: { opacity: 1 },
  transition: { duration: DURATION.swap, ease: EASE_OUT },
};

/**
 * Valor escrito al final de cada barra: flecha, signo y color (nunca solo color).
 * Va dentro de `BarEndLabels`, que es decorativo (`aria-hidden`): lo que oye un
 * lector de pantalla es el texto alternativo de la gráfica, no esta etiqueta.
 */
export function ChangeBarLabel({ text, rising }: ChangeBarLabelProps) {
  const Icon = rising ? ArrowUpRight : ArrowDownRight;

  return (
    <AnimatePresence initial={false}>
      <motion.span
        key={text}
        data-slot="trend-label"
        data-rising={rising}
        className={priceChangeVariants({ direction: rising ? "up" : "down", size: "sm" })}
        {...VALUE_REFRESH}
      >
        <Icon aria-hidden="true" />
        {text}
      </motion.span>
    </AnimatePresence>
  );
}
