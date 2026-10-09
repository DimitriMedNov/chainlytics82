import { useEffect, useRef, type RefObject } from "react";
import { useAnimate } from "motion/react";
import { FADE, REFRESHED, VISIBLE } from "@/ui/pages/watchlist/watchlist-motion";

/**
 * Fundido corto de una cifra cuando cambia (los precios se refrescan cada
 * minuto): se atenúa y vuelve, para que se note cuál cambió. No se reproduce
 * al pintar la fila por primera vez. Solo `opacity`, así que vale también con
 * «reducir movimiento».
 */
export function useRefreshFade<T extends HTMLElement>(value: string): RefObject<T> {
  const [scope, animate] = useAnimate<T>();
  const shown = useRef(value);

  useEffect(() => {
    if (shown.current === value) return;
    shown.current = value;
    const controls = animate(scope.current, { opacity: [REFRESHED.opacity ?? 0, VISIBLE.opacity ?? 1] }, FADE);
    return () => controls.stop();
  }, [animate, scope, value]);

  return scope;
}
