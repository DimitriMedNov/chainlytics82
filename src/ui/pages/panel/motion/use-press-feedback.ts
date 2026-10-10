import { useReducedMotion, type MotionProps } from "motion/react";
import { PRESS_FEEDBACK } from "@/ui/pages/panel/motion/presets";

/** Sin respuesta de pulsación: el elemento no recibe ninguna transformación. */
const NO_PRESS_FEEDBACK: Pick<MotionProps, "whileTap" | "transition"> = {};

/**
 * Props de respuesta al pulsar (se hunde un poco y vuelve).
 * Con «reducir movimiento» no devuelve nada: `MotionConfig reducedMotion="user"` no quita
 * el `whileTap`, solo lo aplica de golpe, así que hay que no pasarlo.
 */
export function usePressFeedback(): Pick<MotionProps, "whileTap" | "transition"> {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? NO_PRESS_FEEDBACK : PRESS_FEEDBACK;
}
