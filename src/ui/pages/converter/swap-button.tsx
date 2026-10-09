import { ArrowDownUp } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { ARROW_SPRING } from "@/ui/pages/converter/converter-motion";

export interface SwapButtonProps {
  label: string;
  /** Medias vueltas dadas: la flecha gira `turns × 180°`, siempre en el mismo sentido. */
  turns: number;
  onSwap: () => void;
}

/** Botón redondo de intercambio. El giro de la flecha es el de Bencho «asset-swap». */
export function SwapButton({ label, turns, onSwap }: SwapButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      data-slot="converter-swap"
      onClick={onSwap}
      className="size-11 rounded-full bg-card shadow-card"
    >
      <motion.span
        aria-hidden="true"
        className="inline-flex"
        initial={false}
        animate={{ rotate: turns * 180 }}
        transition={ARROW_SPRING}
      >
        <ArrowDownUp />
      </motion.span>
    </Button>
  );
}
