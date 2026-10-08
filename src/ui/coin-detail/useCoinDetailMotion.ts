import { useState } from "react";
import { useReducedMotion, type TargetAndTransition, type Transition, type Variants } from "motion/react";

/**
 * Movimiento del modal de detalle. Un solo motor: Motion (el de Animate UI).
 * Solo `transform` y `opacity`; con «reducir movimiento» no queda ningún
 * desplazamiento ni escalado, como mucho un fundido.
 *
 * Duraciones en segundos (unidad de Motion): 150–250 ms en lo que responde a
 * una acción y hasta 500 ms, sumando retrasos, en lo que entra.
 */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Fundido corto: cambios de estado en el sitio (gráfica, esqueleto → contenido). */
export const FADE_TRANSITION: Transition = { duration: 0.2, ease: "easeOut" };
export const FADE_HIDDEN: TargetAndTransition = { opacity: 0 };
export const FADE_VISIBLE: TargetAndTransition = { opacity: 1 };

export interface DialogEntrance {
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  transition?: Transition;
}

const DIALOG_ENTRANCE: DialogEntrance = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: "easeIn" } },
  transition: { duration: 0.22, ease: EASE_OUT },
};

const NO_OVERRIDE: DialogEntrance = {};

/**
 * Entrada y salida del diálogo. El de fábrica gira 20°, escala desde 0,8 y
 * desenfoca con un muelle de ~750 ms: demasiado para un modal de consulta que
 * se abre muchas veces. Aquí: fundido + escala 0,96 → 1 en 220 ms (150 ms al
 * salir), sin giro ni `filter`.
 *
 * Con «reducir movimiento» no se pasa nada: la primitiva ya hace su fundido
 * de 200 ms sin transformaciones.
 */
export function useDialogEntrance(): DialogEntrance {
  return useReducedMotion() ? NO_OVERRIDE : DIALOG_ENTRANCE;
}

export interface CardStagger {
  /** Para el contenedor de las tarjetas (`initial="hidden"`, `animate="visible"`). */
  list: Variants;
  /** Para cada tarjeta. */
  card: Variants;
}

const CARD_LIST: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.08, staggerChildren: 0.06 } },
};

const CARD_STAGGER: CardStagger = {
  list: CARD_LIST,
  card: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
  },
};

const CARD_STAGGER_REDUCED: CardStagger = {
  list: CARD_LIST,
  card: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: FADE_TRANSITION },
  },
};

/**
 * Entrada escalonada de las tres tarjetas de cifras: suben 8 px con fundido,
 * una cada 60 ms (termina a los 500 ms). Marca el orden de lectura. Con
 * «reducir movimiento», solo el fundido.
 */
export function useCardStagger(): CardStagger {
  return useReducedMotion() ? CARD_STAGGER_REDUCED : CARD_STAGGER;
}

export interface BarEntrance {
  /** `false`: la barra nace ya en su valor. */
  initial: TargetAndTransition | false;
  transition: Transition;
}

const BAR_ENTRANCE: BarEntrance = {
  initial: { x: "-100%" },
  transition: { duration: 0.4, ease: EASE_OUT, delay: 0.1 },
};

const BAR_ENTRANCE_REDUCED: BarEntrance = { initial: false, transition: { duration: 0 } };

/**
 * Relleno de una barra de proporción: crece desde vacía hasta su valor en
 * 400 ms (de fábrica nacía llena y encogía con un muelle largo). Con «reducir
 * movimiento» aparece ya en su valor, sin recorrido.
 */
export function useBarEntrance(): BarEntrance {
  return useReducedMotion() ? BAR_ENTRANCE_REDUCED : BAR_ENTRANCE;
}

/**
 * `true` si, en esta apertura, el modal enseñó antes el esqueleto (la moneda
 * tardó en llegar). Sirve para fundir el contenido solo cuando sustituye al
 * esqueleto: al abrir con la moneda ya cargada basta la entrada del diálogo.
 */
export function useArrivedAfterSkeleton(open: boolean, hasContent: boolean): boolean {
  const [sawSkeleton, setSawSkeleton] = useState(false);

  // Estado derivado de props: se ajusta durante el render, sin efecto.
  if (open && !hasContent && !sawSkeleton) setSawSkeleton(true);
  if (!open && sawSkeleton) setSawSkeleton(false);

  return sawSkeleton;
}
