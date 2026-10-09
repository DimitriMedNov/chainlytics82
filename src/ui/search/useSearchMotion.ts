import { useReducedMotion, type TargetAndTransition, type Transition } from "motion/react";

/**
 * Movimiento de la paleta del buscador. Un solo motor: Motion (el de Animate
 * UI). Solo `transform` y `opacity`; con «reducir movimiento» no queda ningún
 * desplazamiento ni escalado, como mucho un fundido.
 * Duraciones en segundos (unidad de Motion).
 */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Fundido corto: cambio de estado del cuerpo e indicador «Buscando…». */
export const FADE_TRANSITION: Transition = { duration: 0.18, ease: "easeOut" };
export const FADE_HIDDEN: TargetAndTransition = { opacity: 0 };
export const FADE_VISIBLE: TargetAndTransition = { opacity: 1 };

export interface PaletteEntrance {
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  transition?: Transition;
}

const PALETTE_ENTRANCE: PaletteEntrance = {
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 0, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" } },
  transition: { duration: 0.2, ease: EASE_OUT },
};

const NO_OVERRIDE: PaletteEntrance = {};

/**
 * Entrada y salida de la paleta. El diálogo de fábrica gira 20°, escala desde
 * 0,8 y sale con un muelle de 400–800 ms: una paleta de teclado tiene que
 * quitarse de en medio ya. Aquí baja 8 px con fundido en 200 ms y sale en
 * 150 ms. Con «reducir movimiento» no se pasa nada: la primitiva ya hace su
 * fundido de 200 ms sin transformaciones.
 */
export function usePaletteEntrance(): PaletteEntrance {
  return useReducedMotion() ? NO_OVERRIDE : PALETTE_ENTRANCE;
}

export interface RowEntrance {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
}

/** Separación entre filas y tope: la duodécima no espera más que la octava. */
const ROW_STAGGER = 0.025;
const ROW_STAGGER_MAX_STEPS = 8;

/**
 * Entrada de una fila de resultados: sube 6 px con fundido, una cada 25 ms
 * (la última empieza a los 200 ms). Solo corre al montarse la fila, así que
 * mover la selección con las flechas no la repite. Con «reducir movimiento»,
 * solo el fundido y todas a la vez.
 */
export function useRowEntrance(index: number): RowEntrance {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return { initial: FADE_HIDDEN, animate: { opacity: 1, transition: FADE_TRANSITION } };

  const delay = Math.min(index, ROW_STAGGER_MAX_STEPS) * ROW_STAGGER;
  return {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT, delay } },
  };
}

/**
 * Transición del resalte que sigue a la fila seleccionada: se desliza 150 ms.
 * Con «reducir movimiento» salta a su sitio, como hacía sin animación.
 */
export function useHighlightTransition(): Transition {
  return useReducedMotion() ? { duration: 0 } : { duration: 0.15, ease: EASE_OUT };
}
