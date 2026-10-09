import { useReducedMotion } from "motion/react";
import { Button, type ButtonProps } from "@/ui/animate-ui/components/buttons/button";
import { DURATION, EASE_OUT } from "@/ui/pages/markets/motion/presets";

export type PressButtonProps = ButtonProps;

const PRESS_SCALE = 0.96;
const PRESS_OPACITY = 0.7;

/**
 * Botón de Animate UI con la respuesta al pulsar de Mercados: se hunde un poco y
 * vuelve. No crece al pasar el ratón (en la lista hay un botón por fila, pegados)
 * y con «reducir movimiento» no escala: solo se atenúa mientras está pulsado.
 * Funciona igual con ratón, dedo y teclado (Enter o Espacio).
 */
export function PressButton(props: PressButtonProps) {
  const reducedMotion = useReducedMotion() === true;

  return (
    <Button
      hoverScale={1}
      whileTap={reducedMotion ? { opacity: PRESS_OPACITY } : { scale: PRESS_SCALE }}
      transition={{ duration: DURATION.exit, ease: EASE_OUT }}
      {...props}
    />
  );
}
