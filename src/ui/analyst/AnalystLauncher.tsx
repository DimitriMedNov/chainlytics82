import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";
import { LAUNCHER_TRANSITION, useAnalystMotion } from "@/ui/analyst/analystMotion";

export interface AnalystLauncherProps {
  onOpen: () => void;
  /** El panel está abierto (para lectores de pantalla). */
  expanded: boolean;
}

/**
 * Botón flotante redondo de 56 px, abajo a la derecha, que abre el analista.
 * Entra con fundido y escala, y crece un poco bajo el cursor (con «reducir
 * movimiento», solo el fundido).
 */
export function AnalystLauncher({ onOpen, expanded }: AnalystLauncherProps) {
  const m = useAnalystMotion();

  return (
    <motion.button
      type="button"
      data-slot="analyst-launcher"
      aria-label={ANALYST_TEXTS.openLabel}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      onClick={onOpen}
      initial={m.launcherHidden}
      animate={m.launcherVisible}
      whileHover={m.launcherHover}
      whileTap={m.launcherTap}
      transition={LAUNCHER_TRANSITION}
      className="fixed bottom-4 right-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-raised transition-colors hover:bg-primary/90 sm:bottom-6 sm:right-6"
    >
      <Sparkles className="size-6" aria-hidden="true" />
    </motion.button>
  );
}
