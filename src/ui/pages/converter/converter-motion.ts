import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion, type Transition, type Variants } from "motion/react";

/**
 * Movimiento del Convertidor. Un solo motor: Motion. Solo `transform` y
 * `opacity`; con «reducir movimiento» no queda desplazamiento, giro ni
 * escalado: como mucho un fundido. Duraciones en segundos.
 */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Fundido corto: esqueleto → contenido y cambios en el sitio. */
export const FADE: Transition = { duration: 0.2, ease: "easeOut" };
/** Respuesta a una acción (intercambiar, cambiar el valor). */
const QUICK: Transition = { duration: 0.22, ease: EASE_OUT };
/** Giro de la flecha (Bencho «asset-swap»: muelle con un poco de rebote). */
export const ARROW_SPRING: Transition = { type: "spring", duration: 0.25, bounce: 0.15 };

/** Paneles: suben 12 px con fundido, uno cada 70 ms (`custom` = posición). */
const PANEL: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT, delay: index * 0.07 },
  }),
};
const PANEL_REDUCED: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: FADE },
};

export function usePanelEntrance(): Variants {
  return useReducedMotion() ? PANEL_REDUCED : PANEL;
}

export interface RowStagger {
  /** Para la lista (`initial="hidden"`, `animate="visible"`). */
  list: Variants;
  /** Para cada fila. */
  row: Variants;
}

const ROW_LIST: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.05, staggerChildren: 0.04 } },
};
const ROWS: RowStagger = {
  list: ROW_LIST,
  row: { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT } } },
};
const ROWS_REDUCED: RowStagger = {
  list: ROW_LIST,
  row: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: FADE } },
};

/** Filas de un lateral: entran una cada 40 ms al sustituir al esqueleto (marca el orden de lectura). */
export function useRowStagger(): RowStagger {
  return useReducedMotion() ? ROWS_REDUCED : ROWS;
}

/** Texto que cambia en el sitio (línea resumen, pista del resultado). */
const TEXT_IN: Variants = { hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0, transition: QUICK } };
const TEXT_IN_REDUCED: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: FADE } };

export function useTextEntrance(): Variants {
  return useReducedMotion() ? TEXT_IN_REDUCED : TEXT_IN;
}

/** Cambio de icono del botón copiar (copiar ↔ check). */
const ICON_SWAP: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.14, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.1, ease: "easeIn" } },
};
const ICON_SWAP_REDUCED: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.14 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export function useIconSwap(): Variants {
  return useReducedMotion() ? ICON_SWAP_REDUCED : ICON_SWAP;
}

const FROM_BLOCK = '[data-slot="converter-from"]';
const TO_BLOCK = '[data-slot="converter-to"]';
const CROSS_OFFSET = 14;

export interface SwapMotion {
  /** `ref` del contenedor que tiene los dos bloques. */
  scope: ReturnType<typeof useAnimate<HTMLDivElement>>[0];
  /** Medias vueltas de la flecha; se cuentan hacia arriba para que siempre gire en el mismo sentido. */
  turns: number;
  /** Intercambia (acción del hook) y lanza el cruce. */
  onSwap: () => void;
}

/**
 * Intercambio: la acción es la del hook del formulario; aquí solo se cuenta el
 * giro de la flecha y se cruza la entrada de los dos bloques («Desde» llega
 * desde abajo y «Hacia» desde arriba), para que se vea de dónde viene cada valor.
 */
export function useSwapMotion(swap: () => void): SwapMotion {
  const reducedMotion = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [turns, setTurns] = useState(0);

  const onSwap = useCallback(() => {
    swap();
    setTurns((count) => count + 1);
    if (!scope.current) return;
    if (reducedMotion) {
      void animate(`${FROM_BLOCK}, ${TO_BLOCK}`, { opacity: [0.4, 1] }, FADE);
      return;
    }
    void animate(FROM_BLOCK, { opacity: [0.4, 1], y: [CROSS_OFFSET, 0] }, QUICK);
    void animate(TO_BLOCK, { opacity: [0.4, 1], y: [-CROSS_OFFSET, 0] }, QUICK);
  }, [animate, reducedMotion, scope, swap]);

  return { scope, turns: reducedMotion ? 0 : turns, onSwap };
}

/**
 * Fundido breve del elemento cada vez que cambia `value` (no en el primer
 * pintado): avisa de que la cifra es nueva sin mover nada.
 */
export function useValuePulse<T extends HTMLElement>(value: string) {
  const [scope, animate] = useAnimate<T>();
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value || !scope.current) return;
    previous.current = value;
    const controls = animate(scope.current, { opacity: [0.5, 1] }, { duration: 0.18, ease: "easeOut" });
    return () => controls.complete();
  }, [animate, scope, value]);

  return scope;
}
