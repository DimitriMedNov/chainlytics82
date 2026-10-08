import { useReducedMotion } from "motion/react";
import { fadeInStaggered, riseIn, STAGGER } from "@/ui/pages/panel/motion/presets";

/**
 * Props de entrada de una tarjeta según su posición en la fila: funde y sube unos píxeles.
 * Con «reducir movimiento» se queda en el fundido: no se pinta ni un fotograma desplazada.
 */
export function useCardEntrance(index: number) {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? fadeInStaggered(index, STAGGER.card) : riseIn(index);
}
