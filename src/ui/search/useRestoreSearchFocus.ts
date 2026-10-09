import { useCallback, useEffect, useRef } from "react";

const DETAIL_SELECTOR = '[data-slot="coin-detail-dialog"]';

/**
 * Devuelve el foco a quien abrió el buscador cuando se cierra el detalle de la
 * moneda elegida. El detalle se abre mientras la paleta se va: para él, «quien
 * abrió» es la caja de la paleta, que ya no existe al cerrar, y el foco
 * acababa en `<body>`. Aquí se recuerda el elemento que tenía el foco al abrir
 * la paleta y se le devuelve cuando el detalle ha salido del todo.
 *
 * @param detailShown si el detalle está en pantalla (abierto o cargando).
 * @returns manejador para `onOpenAutoFocus` de la paleta.
 */
export function useRestoreSearchFocus(detailShown: boolean): () => void {
  const opener = useRef<HTMLElement | null>(null);
  const wasShown = useRef(false);

  const rememberOpener = useCallback(() => {
    // Radix avisa antes de mover el foco adentro: aún lo tiene quien abrió.
    const active = document.activeElement;
    opener.current = active instanceof HTMLElement && active !== document.body ? active : null;
  }, []);

  useEffect(() => {
    if (detailShown) {
      wasShown.current = true;
      return;
    }
    if (!wasShown.current) return;
    wasShown.current = false;

    let timer: number | undefined;
    const restore = () => {
      const element = opener.current;
      // Si el foco ya está en algún sitio (p. ej. tras «Convertir»), no se toca.
      if (element?.isConnected && document.activeElement === document.body) element.focus();
    };
    // El detalle sigue en la página mientras dura su salida; se espera a que
    // se retire y a que Radix termine su propio reparto de foco (un tick).
    const restoreWhenGone = () => {
      if (document.querySelector(DETAIL_SELECTOR)) return false;
      timer = window.setTimeout(restore, 0);
      return true;
    };

    const observer = new MutationObserver(() => {
      if (restoreWhenGone()) observer.disconnect();
    });
    if (!restoreWhenGone()) observer.observe(document.body, { childList: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [detailShown]);

  return rememberOpener;
}
