import type { MotionProps, Transition } from "motion/react";

/** Curva de salida suave (rápida al empezar, frena al llegar). Sin rebote: es una app de datos. */
export const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Duraciones en segundos. Interacciones 0,15 a 0,25; entradas de sección hasta 0,5. */
export const DURATION = {
  /** Lo que sale al cambiar de estado. */
  exit: 0.15,
  /** Lo que entra al cambiar de estado, o una cifra que se refresca. */
  swap: 0.2,
  /** La capa de carga que deja ver lo de debajo. */
  overlay: 0.25,
  /** Tarjetas y filas, una a una. */
  item: 0.3,
  /** Un panel entero al entrar en la vista. */
  section: 0.45,
} as const;

/** Segundos entre un elemento y el siguiente en una entrada escalonada. */
export const STAGGER = { card: 0.06, row: 0.04 } as const;

/** Píxeles que sube un elemento al entrar. Con movimiento reducido no se usa (ver los hooks). */
export const RISE_OFFSET = { item: 8, section: 12 } as const;

/** Opacidad de la que parte una cifra cuando cambia: se nota el refresco sin que deje de leerse. */
const REFRESH_FROM_OPACITY = 0.3;

type EntranceProps = Pick<MotionProps, "initial" | "animate" | "exit" | "transition">;

/**
 * Entrada de una tarjeta: funde y sube unos píxeles, con retardo según su posición.
 * Se usan objetos y no variantes con nombre para que la animación no se propague
 * a los componentes de Motion que haya dentro (gráficas de Bklit, botones).
 */
export function riseIn(index: number, step: number = STAGGER.card): EntranceProps {
  return {
    initial: { opacity: 0, y: RISE_OFFSET.item },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.item, ease: EASE_OUT, delay: index * step },
  };
}

/** Entrada escalonada solo con fundido (filas de tabla: un `<tr>` no se desplaza). */
export function fadeInStaggered(index: number, step: number = STAGGER.row): EntranceProps {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: DURATION.item, ease: EASE_OUT, delay: index * step },
  };
}

/** Cambio de estado dentro de una zona con el alto reservado: lo viejo se funde y lo nuevo aparece encima. */
export const STATE_SWAP: EntranceProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.swap, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: DURATION.exit, ease: "easeIn" } },
};

/** Una cifra que se refresca: parpadeo corto de opacidad. */
export const VALUE_REFRESH: EntranceProps = {
  initial: { opacity: REFRESH_FROM_OPACITY },
  animate: { opacity: 1 },
  transition: { duration: DURATION.swap, ease: EASE_OUT },
};

/** Respuesta al pulsar algo que abre otra cosa: se hunde un poco y vuelve. Solo `transform`. */
export const PRESS_FEEDBACK: Pick<MotionProps, "whileTap" | "transition"> = {
  whileTap: { scale: 0.98 },
  transition: { duration: DURATION.exit, ease: EASE_OUT },
};

/** Transición de un panel al entrar en la vista (la usa `useScrollReveal`). */
export const SECTION_REVEAL: Transition = { duration: DURATION.section, ease: EASE_OUT };
