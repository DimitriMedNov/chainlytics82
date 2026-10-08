import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { VALUE_REFRESH } from "@/ui/pages/panel/motion/presets";

export interface FadeOnChangeProps {
  /** Cuando cambia, el contenido hace un fundido corto. Normalmente, el propio texto. */
  changeKey: string;
  children: ReactNode;
  className?: string;
  "data-slot"?: string;
  "data-rising"?: boolean;
}

/**
 * `<span>` que avisa de que su contenido se refrescó con un fundido corto.
 * No anima al montar (eso es cosa de la entrada de la tarjeta o la fila) ni
 * deja el texto viejo a la vez que el nuevo: el hueco no cambia de tamaño.
 */
export function FadeOnChange({ changeKey, children, ...props }: FadeOnChangeProps) {
  return (
    <AnimatePresence initial={false}>
      <motion.span key={changeKey} {...VALUE_REFRESH} {...props}>
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
