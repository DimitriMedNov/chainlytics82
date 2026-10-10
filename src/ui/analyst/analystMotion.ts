import { useReducedMotion, type TargetAndTransition, type Transition, type Variants } from "motion/react";

/**
 * Movimiento del Analista IA. Un solo motor: Motion (el de Animate UI). Solo
 * `transform` y `opacity`. `MotionConfig reducedMotion="user"` (en `AppRoot`) NO
 * quita los desplazamientos, escalados ni giros: los aplica de golpe y deja un
 * fotograma con `transform`. Por eso los componentes no usan estas constantes
 * directamente: piden el juego a `useAnalystMotion()`, que con «reducir
 * movimiento» devuelve solo fundidos (ningún `transform`, ni hover, ni pulsar).
 *
 * Duraciones en segundos: 150–250 ms en lo que responde a una acción y hasta
 * 500 ms, sumando retrasos, en lo que entra.
 */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const QUICK: Transition = { duration: 0.2, ease: EASE_OUT };

/** Fundido en el sitio (texto de la respuesta que releva a «Analizando...»). */
export const FADE_HIDDEN: TargetAndTransition = { opacity: 0 };
export const FADE_VISIBLE: TargetAndTransition = { opacity: 1, transition: QUICK };

/** Algo nuevo que entra por abajo: burbuja, «Analizando...», franja de error. */
export const RISE_HIDDEN: TargetAndTransition = { opacity: 0, y: 8 };
export const RISE_VISIBLE: TargetAndTransition = { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_OUT } };
/** «Analizando...» sale un instante después de la pregunta que lo provoca. */
export const RISE_VISIBLE_AFTER: TargetAndTransition = {
  opacity: 1,
  y: 0,
  transition: { duration: 0.22, ease: EASE_OUT, delay: 0.12 },
};

/** Botón flotante: aparece al cargar la app y crece un poco bajo el cursor. */
export const LAUNCHER_HIDDEN: TargetAndTransition = { opacity: 0, scale: 0.8 };
export const LAUNCHER_VISIBLE: TargetAndTransition = { opacity: 1, scale: 1 };
export const LAUNCHER_HOVER: TargetAndTransition = { scale: 1.08 };
export const LAUNCHER_TAP: TargetAndTransition = { scale: 0.94 };
export const LAUNCHER_TRANSITION: Transition = { duration: 0.22, ease: EASE_OUT };

/** Sugerencias: una cada 50 ms (la cuarta termina a los ~430 ms). */
export const SUGGESTION_LIST: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.06, staggerChildren: 0.05 } },
};
export const SUGGESTION_ITEM: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_OUT } },
};

/** Caras del botón enviar/detener: se cruzan en el sitio con un giro corto. */
export const FACE_SHOWN: TargetAndTransition = { opacity: 1, scale: 1, rotate: 0 };
export const FACE_HIDDEN: TargetAndTransition = { opacity: 0, scale: 0.6, rotate: -45 };
export const SEND_TAP: TargetAndTransition = { scale: 0.92 };

/** Un punto de «Analizando...»: sube 2 px y se aclara, en bucle. */
export const DOT_PULSE: TargetAndTransition = { opacity: [0.35, 1, 0.35], y: [0, -2, 0] };
export function dotTransition(index: number): Transition {
  return { duration: 0.9, ease: "easeInOut", repeat: Infinity, delay: index * 0.15 };
}

/** Todo lo que se mueve en el Analista, ya resuelto según la preferencia del sistema. */
export interface AnalystMotion {
  riseHidden: TargetAndTransition;
  riseVisible: TargetAndTransition;
  riseVisibleAfter: TargetAndTransition;
  launcherHidden: TargetAndTransition;
  launcherVisible: TargetAndTransition;
  launcherHover: TargetAndTransition | undefined;
  launcherTap: TargetAndTransition | undefined;
  suggestionItem: Variants;
  faceShown: TargetAndTransition;
  faceHidden: TargetAndTransition;
  sendTap: TargetAndTransition | undefined;
}

const FULL_MOTION: AnalystMotion = {
  riseHidden: RISE_HIDDEN,
  riseVisible: RISE_VISIBLE,
  riseVisibleAfter: RISE_VISIBLE_AFTER,
  launcherHidden: LAUNCHER_HIDDEN,
  launcherVisible: LAUNCHER_VISIBLE,
  launcherHover: LAUNCHER_HOVER,
  launcherTap: LAUNCHER_TAP,
  suggestionItem: SUGGESTION_ITEM,
  faceShown: FACE_SHOWN,
  faceHidden: FACE_HIDDEN,
  sendTap: SEND_TAP,
};

/** Los mismos tiempos y retrasos, sin `y`, `scale` ni `rotate`: solo `opacity`. */
const REDUCED_MOTION: AnalystMotion = {
  riseHidden: FADE_HIDDEN,
  riseVisible: { opacity: 1, transition: RISE_VISIBLE.transition },
  riseVisibleAfter: { opacity: 1, transition: RISE_VISIBLE_AFTER.transition },
  launcherHidden: FADE_HIDDEN,
  launcherVisible: { opacity: 1 },
  launcherHover: undefined,
  launcherTap: undefined,
  suggestionItem: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.22, ease: EASE_OUT } },
  },
  faceShown: { opacity: 1 },
  faceHidden: { opacity: 0 },
  sendTap: undefined,
};

export function useAnalystMotion(): AnalystMotion {
  return useReducedMotion() ? REDUCED_MOTION : FULL_MOTION;
}
