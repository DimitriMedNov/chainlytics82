import type { ReactNode } from "react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { cn } from "@/lib/utils";
import { ENTER, EXIT } from "@/ui/pages/compare/motion";

export interface StatePaneProps {
  /** `false`: aparece sin fundido (las gráficas ya traen su propia entrada). */
  fadeIn: boolean;
  className?: string;
  children: ReactNode;
}

/** Un estado dentro de `StateSwap`. Mientras se va queda `inert`: ni foco ni clics. */
function StatePane({ fadeIn, className, children }: StatePaneProps) {
  const isPresent = useIsPresent();
  return (
    <motion.div
      data-slot="state-pane"
      inert={!isPresent}
      initial={fadeIn ? { opacity: 0 } : false}
      animate={{ opacity: 1, transition: ENTER }}
      exit={{ opacity: 0, transition: EXIT }}
      className={cn("min-w-0", className)}
    >
      {children}
    </motion.div>
  );
}

export interface StateSwapProps extends Partial<Pick<StatePaneProps, "fadeIn">> {
  /** Qué estado se pinta (error, cargando, vacío, éxito). Al cambiar, se cruzan. */
  stateKey: string;
  /** Clases del estado (no del contenedor): por ejemplo su `flex` y su `gap`. */
  className?: string;
  children: ReactNode;
}

/**
 * Cambio entre los estados de un bloque con un fundido cruzado: el que llega se monta
 * al instante (nada espera a la animación) y el que se va se desvanece en la misma
 * celda de la rejilla, sin `position: absolute`. El alto es el del mayor de los dos
 * mientras dura; como los esqueletos miden lo que el contenido, cargar no mueve nada.
 */
export function StateSwap({ stateKey, fadeIn = true, className, children }: StateSwapProps) {
  return (
    <div data-slot="state-swap" className="grid min-w-0 grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1">
      <AnimatePresence initial={false}>
        <StatePane key={stateKey} fadeIn={fadeIn} className={className}>
          {children}
        </StatePane>
      </AnimatePresence>
    </div>
  );
}
