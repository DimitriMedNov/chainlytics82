import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
 * un fundido y 4 px de subida; no se anima ninguna altura. Con «reducir
 * movimiento» solo hay fundido: `MotionConfig` no quita la subida, la aplica de
 * golpe y deja un fotograma desplazado, así que aquí no se le pasa.
 */
export function RevealSlot({ show, className, children }: RevealSlotProps) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <div data-slot="reveal-slot" className={cn(className)}>
      <AnimatePresence initial={false}>
        {show ? (
          <motion.div
            key="contenido"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
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
