import type { MotionProps, Transition } from "motion/react";

/** Curva de salida suave (rápida al empezar, frena al llegar). Sin rebote: es una app de datos. */
export const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Duraciones en segundos. Interacciones 0,15 a 0,25; entradas hasta 0,5. */
export const DURATION = {
  /** Lo que sale al cambiar de estado, y la respuesta al pulsar. */
  exit: 0.15,
  /** Lo que entra al cambiar de estado, o una cifra que se refresca. */
  swap: 0.2,
  /** Tarjetas y filas, una a una. */
  item: 0.3,
} as const;

/** Segundos entre un elemento y el siguiente en una entrada escalonada. */
export const STAGGER = { card: 0.06, row: 0.04 } as const;

/** Cuántas filas entran escalonadas en la primera carga; el resto aparece sin más. */
export const STAGGERED_ROWS = 12;

/** Píxeles que sube un elemento al entrar. Con movimiento reducido no se usa. */
const RISE_OFFSET = 8;

/** Opacidad de la que parte una cifra al refrescarse: se nota sin que deje de leerse. */
export const REFRESH_FROM_OPACITY = 0.3;

export type EntranceProps = Pick<MotionProps, "initial" | "animate" | "exit" | "transition">;

/**
 * Entrada de una tarjeta o fila: funde y, si se permite movimiento, sube unos píxeles.
 * Objetos y no variantes con nombre, para que no se propague a las gráficas de dentro.
 */
export function entrance(index: number, step: number, reducedMotion: boolean): EntranceProps {
  return {
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: RISE_OFFSET },
    animate: reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: DURATION.item, ease: EASE_OUT, delay: index * step },
  };
}

/** Cambio de estado (esqueleto → contenido, vacío, error): lo viejo se funde y luego aparece lo nuevo. */
export const STATE_SWAP: EntranceProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.swap, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: DURATION.exit, ease: "easeIn" } },
};

/** Lo que cambia dentro de un hueco fijo (centro del anillo): fundido corto de entrada. */
export const FADE_IN: EntranceProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: DURATION.swap, ease: EASE_OUT },
};
