import { useCallback, useRef, useState } from "react";

export interface LabelHop {
  /** Sube en uno cada vez que toca saltar; 0 = todavía no ha saltado. */
  hop: number;
  /** Va en `onFocus` del campo. */
  onFocus: () => void;
  /** Va en `onBlur` del campo. */
  onBlur: () => void;
  /** Va en `onOpenChange` del desplegable. */
  onOpenChange: (open: boolean) => void;
}

/**
 * Cuándo salta la etiqueta de un desplegable: una vez al «entrar» en el campo, sea
 * llegando con el foco (teclado) o abriendo la lista (con ratón o dedo la lista se abre
 * sin que el campo llegue a tener el foco). Mientras se sigue dentro no repite: ni al
 * abrir la lista estando ya enfocado, ni cuando el foco vuelve al campo al cerrarla.
 */
export function useLabelHop(): LabelHop {
  const [hop, setHop] = useState(0);
  const inside = useRef(false);
  const open = useRef(false);

  const enter = useCallback(() => {
    if (inside.current) return;
    inside.current = true;
    setHop((count) => count + 1);
  }, []);

  const onBlur = useCallback(() => {
    // Con la lista abierta el foco pasa a sus opciones: se sigue dentro del campo.
    if (!open.current) inside.current = false;
  }, []);

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      open.current = isOpen;
      if (isOpen) enter();
    },
    [enter],
  );

  return { hop, onFocus: enter, onBlur, onOpenChange };
}
