import { useEffect, useRef, type RefObject } from "react";
import { animate, useMotionValue, useReducedMotion, type MotionValue } from "motion/react";
import { LEAN, LEAN_FADE, LEAN_MAX } from "@/ui/pages/compare/motion";

export interface GroupLean<T extends HTMLElement> {
  /** Va en el contenedor del grupo: su caja (que no se mueve) es la referencia. */
  ref: RefObject<T | null>;
  /** Desplazamiento compartido por todos los elementos del grupo, en píxeles. */
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/** Solo con ratón: en táctil no hay cursor que seguir y el grupo se quedaría inclinado. */
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * Imán de grupo, de Bencho «Magnetic select»: el grupo entero se inclina hacia el cursor.
 * Nada en el centro (ahí no hay dirección), todo en el borde, y se apaga al alejarse.
 * Un solo listener para todo el grupo, limitado a un cálculo por fotograma.
 * Con «reducir movimiento» o en pantallas táctiles no hace nada.
 */
export function useGroupLean<T extends HTMLElement>(): GroupLean<T> {
  const ref = useRef<T | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia(FINE_POINTER).matches) return;
    let frame = 0;
    let next = { x: 0, y: 0 };
    const publish = () => {
      frame = 0;
      animate(x, next.x, LEAN);
      animate(y, next.y, LEAN);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(publish);
    };
    const read = (event: PointerEvent) => {
      const el = ref.current;
      if (!el || event.pointerType !== "mouse") return;
      const box = el.getBoundingClientRect();
      const halfW = box.width / 2 || 1;
      const halfH = box.height / 2 || 1;
      const dx = event.clientX - (box.left + halfW);
      const dy = event.clientY - (box.top + halfH);
      const distance = Math.hypot(dx, dy) || 1;
      const rise = Math.min(1, Math.hypot(dx / halfW, dy / halfH));
      const outside = Math.hypot(Math.max(0, Math.abs(dx) - halfW), Math.max(0, Math.abs(dy) - halfH));
      const drawn = rise * Math.max(0, 1 - outside / LEAN_FADE) * LEAN_MAX;
      next = { x: (dx / distance) * drawn, y: (dy / distance) * drawn };
      schedule();
    };
    const gone = () => {
      next = { x: 0, y: 0 };
      schedule();
    };
    document.addEventListener("pointermove", read, { passive: true });
    document.addEventListener("pointerleave", gone);
    return () => {
      document.removeEventListener("pointermove", read);
      document.removeEventListener("pointerleave", gone);
      cancelAnimationFrame(frame);
      x.set(0);
      y.set(0);
    };
  }, [reduced, x, y]);

  return { ref, x, y };
}
