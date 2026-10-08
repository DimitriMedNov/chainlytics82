import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { QUICK } from "@/ui/pages/portfolio/motion";

export interface RevealSlotProps {
  /** `true` mientras el contenido deba verse. */
  show: boolean;
  /**
   * Clases del hueco, que existe siempre. Aquí va el alto reservado
   * (`min-h-*`): lo que aparece dentro no empuja lo que hay debajo.
   */
  className?: string;
  children: ReactNode;
}

/**
 * Hueco con el espacio reservado para un mensaje que aparece y desaparece
 * (total de la operación, error del formulario). El contenido entra y sale con
 * un fundido y 4 px de subida; no se anima ninguna altura.
 */
export function RevealSlot({ show, className, children }: RevealSlotProps) {
  return (
    <div data-slot="reveal-slot" className={cn(className)}>
      <AnimatePresence initial={false}>
        {show ? (
          <motion.div
            key="contenido"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={QUICK}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
