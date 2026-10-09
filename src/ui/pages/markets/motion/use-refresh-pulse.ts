import { useEffect, useRef, type RefObject } from "react";
import { animate } from "motion/react";
import { DURATION, EASE_OUT, REFRESH_FROM_OPACITY } from "@/ui/pages/markets/motion/presets";

/** true si el elemento se ve ahora mismo en la ventana (aunque sea en parte). */
function isOnScreen(element: HTMLElement): boolean {
  const { top, bottom } = element.getBoundingClientRect();
  return bottom > 0 && top < window.innerHeight;
}

/**
 * Fundido corto sobre un elemento cuando su cifra se refresca (el precio de cada minuto).
 * Pensado para las 100 filas: no crea componentes de Motion, no anima al montar y solo
 * mueve las filas que están en pantalla, así nunca hay 100 animaciones a la vez.
 * Solo cambia la opacidad, así que vale igual con «reducir movimiento».
 */
export function useRefreshPulse<T extends HTMLElement>(changeKey: string): RefObject<T | null> {
  const ref = useRef<T>(null);
  const previousKey = useRef(changeKey);

  useEffect(() => {
    if (previousKey.current === changeKey) return;
    previousKey.current = changeKey;

    const element = ref.current;
    if (!element || !isOnScreen(element)) return;

    const controls = animate(
      element,
      { opacity: [REFRESH_FROM_OPACITY, 1] },
      { duration: DURATION.swap, ease: EASE_OUT },
    );
    // `complete` y no `stop`: si se corta a medias, la cifra queda a opacidad plena.
    return () => controls.complete();
  }, [changeKey]);

  return ref;
}
