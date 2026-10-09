import { useEffect, useRef, type RefObject } from "react";

/**
 * El campo se deshabilita mientras llega la respuesta y pierde el foco. Al
 * terminar se lo devuelve, salvo que la persona ya lo haya llevado a otro sitio.
 */
export function useRefocusWhenIdle(busy: boolean): RefObject<HTMLInputElement | null> {
  const ref = useRef<HTMLInputElement | null>(null);
  const wasBusy = useRef(busy);

  useEffect(() => {
    const finished = wasBusy.current && !busy;
    wasBusy.current = busy;
    if (!finished) return;
    const input = ref.current;
    const active = document.activeElement;
    if (!input || !active) return;
    // El foco quedó en el propio formulario o cayó a un contenedor (la hoja, el body).
    if (active.contains(input) || input.form?.contains(active)) input.focus();
  }, [busy]);

  return ref;
}
