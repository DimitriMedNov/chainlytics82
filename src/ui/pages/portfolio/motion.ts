import type { Transition, Variants } from "motion/react";

/*
 * Movimiento de la pantalla Portfolio (motor: Motion, el de Animate UI).
 * Solo `opacity` y desplazamientos con `x` / `y` / `scale` (transform).
 * `MotionConfig reducedMotion="user"` (en `AppRoot`) NO quita esos
 * desplazamientos: los aplica de golpe y deja un fotograma movido. Por eso cada
 * componente pregunta `useReducedMotion()` y, con «reducir movimiento», no pasa
 * ningún `x` / `y` / `scale` / `layout`: solo el fundido.
 */

/** Curva de salida suave: arranca rápido y frena. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Entrada de un bloque o de una fila. */
export const ENTER: Transition = { duration: 0.32, ease: EASE_OUT };

/** Respuesta a una acción (aparecer, desaparecer, recolocar). */
export const QUICK: Transition = { duration: 0.18, ease: "easeOut" };

/** Retraso entre una fila y la siguiente al entrar, en segundos. */
const STAGGER = 0.05;
/** A partir de la octava fila ya no se añade más retraso. */
const MAX_STAGGERED = 8;

/**
 * Fila de una lista: entra subiendo 8 px y sale con un fundido corto. El
 * escalonado va en la propia fila (`custom={índice}`), no en la lista: una fila
 * con `exit="exit"` controla sus variantes y Motion ya no le hereda las del
 * padre, así que `staggerChildren` en la `<ul>` no hacía nada.
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...ENTER, delay: Math.min(index, MAX_STAGGERED) * STAGGER },
  }),
  exit: { opacity: 0, x: -8, transition: QUICK },
};

/** La misma fila con «reducir movimiento»: solo fundido, sin desplazamiento ni escalonado. */
export const reducedItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: QUICK },
  exit: { opacity: 0, transition: QUICK },
};

/**
 * Lo que tarda en empezar a irse la fila de un movimiento borrado, en segundos:
 * la marca de «hecho» de su papelera (`RemoveTransactionButton`) termina de
 * aparecer a los 240 ms y se queda quieta unos 160 ms antes de que la fila
 * empiece a irse. El borrado y su aviso no esperan; solo la salida.
 */
const EXIT_HOLD = 0.4;
const HELD: Transition = { ...QUICK, delay: EXIT_HOLD };

/** Fila que se queda un instante antes de salir (movimientos). */
export const heldItemVariants: Variants = {
  ...itemVariants,
  exit: { opacity: 0, x: -8, transition: HELD },
};

/** Lo mismo con «reducir movimiento»: solo fundido. */
export const reducedHeldItemVariants: Variants = {
  ...reducedItemVariants,
  exit: { opacity: 0, transition: HELD },
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
