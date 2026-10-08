import { useLayoutEffect, useRef, type RefObject } from "react";
import { animate, inView, useMotionValue, useReducedMotion, type MotionValue } from "motion/react";
import { RISE_OFFSET, SECTION_REVEAL } from "@/ui/pages/panel/motion/presets";

export interface ScrollReveal<T extends HTMLElement> {
  /** Va en el elemento que entra. */
  ref: RefObject<T | null>;
  /** Va en el `style` de un componente de Motion. */
  style: { opacity: MotionValue<number>; y: MotionValue<number> };
}

/** Parte del elemento que tiene que asomar para que empiece la entrada. */
const VISIBLE_AMOUNT = 0.1;

/**
 * Entrada de un bloque al llegar a él con el scroll: funde y sube unos píxeles, una sola vez.
 *
 * - Lo que ya está en pantalla al montar NO se anima: se lee de inmediato.
 * - El bloque se pinta visible; solo se oculta (antes del primer pintado) si queda
 *   por debajo de la pantalla, así nunca hay contenido escondido esperando a nadie.
 * - Con «reducir movimiento» no hay desplazamiento, solo el fundido.
 * - No toca el scroll: solo observa (IntersectionObserver) y deja de observar al entrar.
 */
export function useScrollReveal<T extends HTMLElement>(): ScrollReveal<T> {
  const ref = useRef<T>(null);
  const opacity = useMotionValue(1);
  const y = useMotionValue(0);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    opacity.set(0);
    if (!reducedMotion) y.set(RISE_OFFSET.section);

    const running: Array<{ stop: () => void }> = [];
    const stopObserving = inView(
      element,
      () => {
        running.push(animate(opacity, 1, SECTION_REVEAL), animate(y, 0, SECTION_REVEAL));
      },
      { amount: VISIBLE_AMOUNT },
    );

    return () => {
      stopObserving();
      running.forEach((animation) => animation.stop());
      opacity.set(1);
      y.set(0);
    };
  }, [opacity, y, reducedMotion]);

  return { ref, style: { opacity, y } };
}
