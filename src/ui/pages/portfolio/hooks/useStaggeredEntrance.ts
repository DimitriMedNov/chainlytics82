import { useLayoutEffect, useRef, type RefObject } from "react";
import { animate, createScope, stagger, utils, type Scope } from "animejs";

/** Consulta del sistema «reducir movimiento». */
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Entrada escalonada (Anime.js) de los descendientes de la raíz que casan con
 * `selector`: fundido + subida de 8 px, uno tras otro. Con «reducir movimiento»
 * queda solo un fundido corto, sin desplazamiento ni escalonado.
 *
 * Sirve para componentes compartidos que no se pueden convertir en `motion.*`.
 * `useLayoutEffect` y no `useEffect`: el estado inicial (opacidad 0) se pone
 * antes del primer pintado, para que las tarjetas no parpadeen.
 */
export function useStaggeredEntrance<T extends HTMLElement>(selector: string): RefObject<T | null> {
  const root = useRef<T>(null);
  const scope = useRef<Scope | null>(null);

  useLayoutEffect(() => {
    scope.current = createScope({ root, mediaQueries: { reduce: REDUCE_QUERY } }).add((self) => {
      const reduce = self?.matches.reduce === true;
      animate(selector, {
        opacity: [0, 1],
        ...(reduce ? {} : { translateY: [8, 0] }),
        duration: reduce ? 200 : 400,
        delay: reduce ? 0 : stagger(60),
        ease: "out(3)",
        // Al acabar no queda ningún estilo en línea (ni `transform` ni `opacity`).
        onComplete: (animation) => {
          utils.cleanInlineStyles(animation);
        },
      });
    });
    return () => scope.current?.revert();
  }, [selector]);

  return root;
}
