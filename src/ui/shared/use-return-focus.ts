import { useCallback, useRef } from "react";

/** Lo mínimo que se usa del evento de Radix: poder cancelar su comportamiento por defecto. */
export interface ReturnFocusEvent {
  defaultPrevented: boolean;
  preventDefault: () => void;
}

export interface ReturnFocusHandlers {
  /** Para `onOpenAutoFocus` del contenido: recuerda quién tenía el foco al abrir. */
  onOpenAutoFocus: (event?: ReturnFocusEvent) => void;
  /** Para `onCloseAutoFocus`: devuelve el foco a quien abrió, si sigue en la página. */
  onCloseAutoFocus: (event?: ReturnFocusEvent) => void;
}

/**
 * Devuelve el foco de teclado al elemento que abrió un diálogo, hoja o menú
 * cuando se cierra. Hace falta cuando se abre por estado (`open`), sin
 * `DialogTrigger`: Radix no sabe a quién devolvérselo y el foco acaba en
 * `<body>`, con lo que quien navega con teclado pierde su sitio.
 *
 * El `Dialog` de `@/ui/animate-ui` ya lo lleva dentro: este hook es para
 * `Sheet`, `AlertDialog`, `Popover` y cualquier otra capa abierta por estado.
 */
export function useReturnFocus(): ReturnFocusHandlers {
  const opener = useRef<HTMLElement | null>(null);

  const onOpenAutoFocus = useCallback(() => {
    // Radix avisa antes de mover el foco adentro: aún lo tiene quien abrió.
    const active = document.activeElement;
    opener.current = active instanceof HTMLElement && active !== document.body ? active : null;
  }, []);

  const onCloseAutoFocus = useCallback((event?: ReturnFocusEvent) => {
    const element = opener.current;
    opener.current = null;
    // Si quien abrió ya no existe (se navegó, la fila se borró) o el consumidor
    // ya decidió otro destino, no se fuerza nada: Radix sigue con lo suyo.
    if (!element?.isConnected || event?.defaultPrevented) return;
    event?.preventDefault();
    element.focus();
  }, []);

  return { onOpenAutoFocus, onCloseAutoFocus };
}
