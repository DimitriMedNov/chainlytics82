import type { Transition, Variants } from "motion/react";

/*
 * Movimiento de la pantalla Portfolio (motor: Motion, el de Animate UI).
 * Solo `opacity` y desplazamientos con `x` / `y` / `scale` (transform), nunca
 * una cadena `transform`: así `MotionConfig reducedMotion="user"` (en
 * `AppRoot`) quita el desplazamiento y deja únicamente el fundido.
 */

/** Curva de salida suave: arranca rápido y frena. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Entrada de un bloque o de una fila. */
export const ENTER: Transition = { duration: 0.32, ease: EASE_OUT };

/** Respuesta a una acción (aparecer, desaparecer, recolocar). */
export const QUICK: Transition = { duration: 0.18, ease: "easeOut" };

/** Lista: sus filas entran una tras otra la primera vez. */
export const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

/**
 * Fila de una lista: entra subiendo 8 px y sale con un fundido corto. Una fila
 * añadida después (un movimiento nuevo) entra sola, sin volver a escalonar.
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: ENTER },
  exit: { opacity: 0, x: -8, transition: QUICK },
};

/** Recolocación de las filas vecinas cuando una entra o sale (solo transform). */
export const itemLayoutTransition: Transition = { layout: { duration: 0.22, ease: EASE_OUT } };

/**
 * Entrada y salida de los dos diálogos, en vez del giro + escala + desenfoque
 * de 750 ms que trae Animate UI: fundido con una escala mínima en 200 ms.
 */
export const dialogMotion = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.2, ease: EASE_OUT },
} as const;

/** Barra de peso: crece desde cero hasta su valor en medio segundo. */
export function weightBarTransition(index: number): Transition {
  return { duration: 0.5, ease: EASE_OUT, delay: Math.min(index, 8) * 0.04 };
}
