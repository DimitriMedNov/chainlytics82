import type { KeyboardEvent } from "react";

/**
 * cmdk escucha Enter en toda la paleta y cancela la tecla (la quiere para
 * abrir el resultado marcado). En un botón de dentro eso anula su pulsación
 * con teclado: el botón se queda la tecla para sí.
 */
export function keepEnterForButton(event: KeyboardEvent<HTMLButtonElement>) {
  if (event.key === "Enter") event.stopPropagation();
}
