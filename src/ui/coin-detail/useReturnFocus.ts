import { useCallback, useRef } from "react";

export interface ReturnFocusHandlers {
  /** Para `onOpenAutoFocus` del contenido del diálogo: recuerda quién lo abrió. */
  onOpenAutoFocus: () => void;
  /** Para `onCloseAutoFocus`: devuelve el foco a quien lo abrió, si sigue en la página. */
  onCloseAutoFocus: () => void;
}

/**
 * Devuelve el foco de teclado al elemento que abrió el modal cuando termina
 * la animación de salida. El diálogo se abre por estado (`open`), sin
 * `DialogTrigger`, y en ese caso Radix no sabe a quién devolvérselo: el foco
 * acababa en `<body>` y el usuario de teclado perdía su sitio en la lista.
 */
export function useReturnFocus(): ReturnFocusHandlers {
  const opener = useRef<HTMLElement | null>(null);

  const onOpenAutoFocus = useCallback(() => {
    // Radix avisa antes de mover el foco adentro: aún lo tiene quien abrió.
    const active = document.activeElement;
    opener.current = active instanceof HTMLElement && active !== document.body ? active : null;
  }, []);

  const onCloseAutoFocus = useCallback(() => {
    const element = opener.current;
    opener.current = null;
    // Tras «Convertir» se navega y quien abrió ya no existe: no se fuerza nada.
    if (element?.isConnected) element.focus();
  }, []);

  return { onOpenAutoFocus, onCloseAutoFocus };
}
