import { useCallback, useRef } from "react";
import { STAGGERED_ROWS } from "@/ui/pages/markets/motion/presets";

export interface UseFirstRevealResult {
  /**
   * Puesto de la fila en la entrada escalonada, o `null` si entra sin animar.
   * Solo da número en la primera carga y a las primeras filas. Cada fila lo
   * consulta una vez, al montarse.
   */
  enterIndexFor: (index: number) => number | null;
  /** Lo llama la lista cuando ya pintó por primera vez: desde ahí nada vuelve a escalonarse. */
  markRevealed: () => void;
}

/**
 * Recuerda si la lista ya se enseñó una vez. Vive en el panel (que no se desmonta al
 * filtrar), para que al teclear o al volver de un vacío las filas no repitan la entrada.
 */
export function useFirstReveal(): UseFirstRevealResult {
  const revealed = useRef(false);

  const enterIndexFor = useCallback(
    (index: number) => (revealed.current || index >= STAGGERED_ROWS ? null : index),
    [],
  );
  const markRevealed = useCallback(() => {
    revealed.current = true;
  }, []);

  return { enterIndexFor, markRevealed };
}
