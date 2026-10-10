import type { ReactNode } from "react";
import { Liquid } from "liquid-gooey";

/** Lado del botón (44 px, `size-11`) y hueco con la barra (8 px, `gap-2`). */
const BUTTON_SIZE = 44;
const GAP = 8;
/** Lo que retrocede el botón para quedar fundido en el extremo derecho de la barra. */
const TUCK = BUTTON_SIZE + GAP;
/** La curva de Bencho (se pasa un poco y vuelve), acortada a 250 ms. */
const MORPH = { duration: 250, ease: "cubic-bezier(0.22, 1.3, 0.71, 1)" } as const;

export interface AnalystFormBarProps {
  /** El botón está separado de la barra (si no, fundido en su extremo derecho). */
  split: boolean;
  /** «Reducir movimiento»: dos piezas quietas, sin líquido y sin `transform`. */
  still: boolean;
  field: ReactNode;
  button: ReactNode;
}

/**
 * Los dos cuerpos de la barra de pregunta. Con movimiento son líquido
 * (`liquid-gooey`, que siempre escribe un `transform` en cada pieza); con
 * «reducir movimiento» son dos cajas normales del mismo color, siempre separadas.
 */
export function AnalystFormBar({ split, still, field, button }: AnalystFormBarProps) {
  if (still) {
    return (
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1 rounded-full bg-muted">{field}</div>
        <div className="shrink-0 rounded-full bg-muted">{button}</div>
      </div>
    );
  }

  return (
    <Liquid blur={3} contrast={22} fill="hsl(var(--muted))" className="flex items-center gap-2">
      <Liquid.Item className="block min-w-0 flex-1" transition={MORPH}>
        {field}
      </Liquid.Item>
      <Liquid.Item className="block shrink-0" x={split ? 0 : -TUCK} transition={MORPH}>
        {button}
      </Liquid.Item>
    </Liquid>
  );
}
