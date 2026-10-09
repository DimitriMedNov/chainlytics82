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

/**
 * Imán del grupo de chips (Bencho «Magnetic select»): todos se inclinan unos píxeles
 * hacia el cursor con el mismo vector, así los huecos entre ellos no cambian.
 * `LEAN_MAX` píxeles como mucho (a partir de unos 7 parecería que se arrastra);
 * `LEAN_FADE` píxeles fuera del grupo en los que el efecto se apaga.
 */
export const LEAN_MAX = 4.5;
export const LEAN_FADE = 44;
/** Amortigua un valor que cambia en cada fotograma: se lee como freno, no como seguimiento. */
export const LEAN: Transition = { duration: 0.26, ease: [0.22, 0.9, 0.28, 1] };

/**
 * Saltito de la etiqueta al enfocar su campo (Bencho «Label input»): cada letra sube
 * `HOP_OFFSET` píxeles y vuelve, una detrás de otra cada `HOP_STAGGER` segundos.
 */
export const HOP_OFFSET = -3;
export const HOP_STAGGER = 0.024;
export const HOP: Transition = {
  duration: 0.46,
  times: [0, 0.38, 1],
  ease: [0.3, 0.7, 0.3, 1],
};

export { EASE_OUT };
