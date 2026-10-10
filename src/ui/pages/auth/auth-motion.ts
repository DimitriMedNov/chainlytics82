import { useReducedMotion, type TargetAndTransition, type Transition } from "motion/react";

/**
 * Movimiento de la pantalla de acceso. Un solo motor: Motion (el de Animate UI).
 * Solo `transform` y `opacity`. Con «reducir movimiento» queda, como mucho, el
 * fundido: `MotionConfig reducedMotion="user"` no quita `y`, `scale`, `rotate` ni
 * `layout` (los aplica de golpe y deja un fotograma con `transform`), así que
 * `useAuthMotion` directamente no los pasa.
 *
 * Duraciones en segundos (unidad de Motion): 120–250 ms en lo que responde a
 * una acción y 400 ms en la entrada de la tarjeta.
 */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Entrada de la tarjeta (marco): sube 12 px mientras aparece. */
export const FRAME_HIDDEN: TargetAndTransition = { opacity: 0, y: 12 };
export const FRAME_VISIBLE: TargetAndTransition = { opacity: 1, y: 0 };
export const FRAME_TRANSITION: Transition = {
  duration: 0.4,
  ease: EASE_OUT,
  // Cuando un error la hace crecer, va al paso de lo que se recoloca dentro.
  layout: { duration: 0.22, ease: EASE_OUT },
};

/** Fundido en el sitio: esqueleto → formulario y texto del botón al cambiar de pestaña. */
export const FADE_HIDDEN: TargetAndTransition = { opacity: 0 };
export const FADE_VISIBLE: TargetAndTransition = { opacity: 1 };
export const FADE_TRANSITION: Transition = { duration: 0.2, ease: "easeOut" };
export const SWAP_TRANSITION: Transition = { duration: 0.12, ease: "easeOut" };

/** Errores (de campo y del servicio): aparecen bajando 4 px; se van solo con fundido. */
export const ERROR_HIDDEN: TargetAndTransition = { opacity: 0, y: -4 };
export const ERROR_VISIBLE: TargetAndTransition = { opacity: 1, y: 0 };
export const ERROR_EXIT: TargetAndTransition = { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } };

/** Lo que un error desplaza (el campo de debajo, el botón) se recoloca con `transform`, no de golpe. */
export const SHIFT_TRANSITION: Transition = { layout: { duration: 0.22, ease: EASE_OUT } };

/** Icono de la cabecera: entra girando un poco y asentándose. */
export const ICON_HIDDEN: TargetAndTransition = { opacity: 0, scale: 0.6, rotate: -24 };
export const ICON_VISIBLE: TargetAndTransition = { opacity: 1, scale: 1, rotate: 0 };
export const ICON_TRANSITION: Transition = { type: "spring", stiffness: 320, damping: 18, delay: 0.12 };

/** Indicador de envío del botón. */
export const SPINNER_HIDDEN: TargetAndTransition = { opacity: 0, scale: 0.6 };
export const SPINNER_VISIBLE: TargetAndTransition = { opacity: 1, scale: 1 };
export const SPIN: TargetAndTransition = { rotate: 360 };
export const SPIN_TRANSITION: Transition = { duration: 0.9, ease: "linear", repeat: Infinity };
/** Con «reducir movimiento» no gira: late con un fundido. */
export const PULSE: TargetAndTransition = { opacity: [1, 0.4, 1] };
export const PULSE_TRANSITION: Transition = { duration: 1.2, ease: "easeInOut", repeat: Infinity };

/**
 * Salto de las letras de la etiqueta al enfocar (bloque «Label input» de Bencho):
 * cada letra sube 3 px y se asienta, una tras otra.
 */
export const HOP: TargetAndTransition = { y: [0, -3, 0] };
export const HOP_REST: TargetAndTransition = { y: 0 };
export function hopTransition(index: number): Transition {
  return { duration: 0.46, times: [0, 0.38, 1], ease: "easeOut", delay: index * 0.024 };
}

/** Lo que cada pieza de la pantalla pasa a Motion, ya resuelto según «reducir movimiento». */
export interface AuthMotion {
  /** `true` con «reducir movimiento»: solo fundidos, ningún `transform`. */
  reduced: boolean;
  /** Valor de `layout` para lo que cambia de tamaño (marco y tarjeta). */
  layoutSize: true | undefined;
  /** Valor de `layout` para lo que solo se recoloca (campos, error, botón). */
  layoutPosition: "position" | undefined;
  frameHidden: TargetAndTransition;
  frameVisible: TargetAndTransition;
  errorHidden: TargetAndTransition;
  errorVisible: TargetAndTransition;
  iconHidden: TargetAndTransition;
  iconVisible: TargetAndTransition;
  iconTransition: Transition;
  spinnerHidden: TargetAndTransition;
  spinnerVisible: TargetAndTransition;
}

const FULL_MOTION: AuthMotion = {
  reduced: false,
  layoutSize: true,
  layoutPosition: "position",
  frameHidden: FRAME_HIDDEN,
  frameVisible: FRAME_VISIBLE,
  errorHidden: ERROR_HIDDEN,
  errorVisible: ERROR_VISIBLE,
  iconHidden: ICON_HIDDEN,
  iconVisible: ICON_VISIBLE,
  iconTransition: ICON_TRANSITION,
  spinnerHidden: SPINNER_HIDDEN,
  spinnerVisible: SPINNER_VISIBLE,
};

/** Sin `layout` y sin `transform`: lo que cambia de sitio lo hace de una vez, por el flujo normal. */
const REDUCED_MOTION: AuthMotion = {
  reduced: true,
  layoutSize: undefined,
  layoutPosition: undefined,
  frameHidden: FADE_HIDDEN,
  frameVisible: FADE_VISIBLE,
  errorHidden: FADE_HIDDEN,
  errorVisible: FADE_VISIBLE,
  iconHidden: FADE_HIDDEN,
  iconVisible: FADE_VISIBLE,
  iconTransition: FADE_TRANSITION,
  spinnerHidden: FADE_HIDDEN,
  spinnerVisible: FADE_VISIBLE,
};

/** Movimiento de la pantalla de acceso según la preferencia «reducir movimiento» del sistema. */
export function useAuthMotion(): AuthMotion {
  return useReducedMotion() === true ? REDUCED_MOTION : FULL_MOTION;
}
