import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Lleva el contenedor con scroll al final cada vez que cambia `signal`
 * (un mensaje nuevo, un trozo más de respuesta, un aviso). El desplazamiento
 * es suave; con «reducir movimiento» salta directo al final.
 */
export function useStickToBottom<T extends HTMLElement>(signal: unknown): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();
  const mounted = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Al abrir el panel se coloca al final sin recorrer la conversación entera.
    const smooth = mounted.current && !reduced;
    mounted.current = true;
    element.scrollTo({ top: element.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, [signal, reduced]);

  return ref;
}
