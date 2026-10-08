import type { Transition } from "motion/react";

/**
 * Tiempos del movimiento de la pantalla Comparar (un solo motor: Motion).
 * Interacciones 150-250 ms; entrada de sección hasta 500 ms. Solo `transform` y `opacity`.
 * Con «reducir movimiento», `MotionConfig reducedMotion="user"` (en `AppRoot`) quita
 * desplazamientos, escalados y animaciones de layout; quedan los fundidos.
 */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Algo que aparece: chip nuevo, fila, estado de un panel. */
export const ENTER: Transition = { duration: 0.2, ease: EASE_OUT };

/** Algo que se va: más corto que la entrada, para no estorbar a lo que llega. */
export const EXIT: Transition = { duration: 0.15, ease: "easeIn" };

/** Recolocación de vecinos (chips que se cierran, filas que cambian de puesto). */
export const REORDER: Transition = { duration: 0.25, ease: EASE_OUT };

/** Entrada de un bloque de la página. */
export const SECTION: Transition = { duration: 0.4, ease: EASE_OUT };

/** Segundos entre la entrada de un bloque y la del siguiente. */
export const SECTION_STAGGER = 0.06;

/** Píxeles que sube un bloque al entrar. */
export const SECTION_OFFSET = 8;

/** Escala de la que parte (y a la que vuelve) un chip. */
export const CHIP_SCALE = 0.9;

/** Segundos que tarda una cifra en llegar a su valor nuevo. */
export const NUMBER_DURATION = 0.4;

export { EASE_OUT };
