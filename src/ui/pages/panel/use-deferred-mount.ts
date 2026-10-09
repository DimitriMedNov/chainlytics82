import { useEffect, useState, type RefObject } from "react";

export interface DeferredMountOptions {
  /** Margen alrededor de la pantalla con el que el bloque ya cuenta como «cerca» (sintaxis de CSS). */
  rootMargin?: string;
  /** Espera máxima, en ms, a que el navegador quede libre una vez que el bloque está cerca. */
  idleTimeout?: number;
}

const DEFAULT_ROOT_MARGIN = "200px 0px";
const DEFAULT_IDLE_TIMEOUT = 1500;
/** Espera cuando el navegador no tiene `requestIdleCallback` (Safari). */
const FALLBACK_DELAY = 200;

/** Llama a `task` cuando el navegador queda libre. Devuelve cómo cancelarlo. */
function whenIdle(task: () => void, timeout: number): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, FALLBACK_DELAY);
  return () => window.clearTimeout(id);
}

/** Llama a `task` con la página ya cargada del todo (evento `load`). Devuelve cómo cancelarlo. */
function whenPageLoaded(task: () => void): () => void {
  if (document.readyState === "complete") {
    task();
    return () => undefined;
  }
  window.addEventListener("load", task, { once: true });
  return () => window.removeEventListener("load", task);
}

/**
 * Dice cuándo conviene montar algo pesado que vive dentro de `ref`: pasa a `true`, una
 * sola vez, cuando el bloque está cerca de entrar en pantalla, la página ya cargó y el
 * navegador quedó libre. Nunca antes del primer pintado, aunque el bloque ya se vea al
 * abrir. Sin `IntersectionObserver` solo espera a la carga y al rato libre.
 */
export function useDeferredMount(
  ref: RefObject<Element | null>,
  { rootMargin = DEFAULT_ROOT_MARGIN, idleTimeout = DEFAULT_IDLE_TIMEOUT }: DeferredMountOptions = {},
): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (ready || !element) return;

    let cancelWait: () => void = () => undefined;
    const arm = () => {
      cancelWait = whenPageLoaded(() => {
        cancelWait = whenIdle(() => setReady(true), idleTimeout);
      });
    };

    if (typeof IntersectionObserver !== "function") {
      arm();
      return () => cancelWait();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        arm();
      },
      { rootMargin },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelWait();
    };
  }, [ref, ready, rootMargin, idleTimeout]);

  return ready;
}
