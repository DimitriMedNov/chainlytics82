import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { EASE_OUT, NUMBER_DURATION } from "@/ui/pages/compare/motion";

/**
 * Devuelve `value`, pero cuando cambia lo recorre desde el valor anterior en vez de
 * saltar: se ve cuánto y hacia dónde se ha movido la cifra. Al montar no cuenta (sale
 * ya con su valor) y con «reducir movimiento» tampoco: devuelve `value` tal cual.
 */
export function useAnimatedNumber(value: number): number {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    if (reduceMotion || current.current === value) {
      current.current = value;
      return;
    }
    const controls = animate(current.current, value, {
      duration: NUMBER_DURATION,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        current.current = latest;
        setShown(latest);
      },
      onComplete: () => {
        current.current = value;
        setShown(value);
      },
    });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return reduceMotion ? value : shown;
}
