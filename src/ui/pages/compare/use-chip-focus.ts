import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import type { SelectedCoin } from "@/hooks/compare/useCompareScreen";
import { ADD_COIN_ID } from "@/ui/pages/compare/constants";

interface PendingFocus {
  at: number;
  /** El chip que hereda el foco: el siguiente al que se quita; si era el último, el anterior. */
  neighborId: string | null;
}

/** Si la selección no cambia en este tiempo (no se llegó a quitar), ya no se mueve el foco. */
const FOCUS_WINDOW_MS = 4000;

function removeButtonOf(region: HTMLElement, coinId: string): HTMLElement | null {
  return region.querySelector<HTMLElement>(
    `[data-slot="coin-chip"]:not([inert])[data-coin-id="${CSS.escape(coinId)}"] [data-action="remove"]`,
  );
}

export interface ChipFocus<T extends HTMLElement> {
  /** Va en el contenedor de los chips y del selector: dentro de él se busca a quién dar el foco. */
  regionRef: RefObject<T | null>;
  /** El mismo `remove`, que además recuerda dónde debe quedar el foco. */
  onRemove: (coinId: string) => void;
}

/**
 * Al quitar un chip su botón desaparece y el foco se quedaría en `<body>` (con teclado, el
 * siguiente Tab volvería a empezar la página). Aquí pasa al botón de quitar del chip vecino
 * y, si no queda ninguno, al selector «Añadir moneda». No cambia lo que hace `remove`.
 */
export function useChipFocus<T extends HTMLElement = HTMLDivElement>(
  selected: SelectedCoin[],
  remove: (coinId: string) => void,
): ChipFocus<T> {
  const regionRef = useRef<T>(null);
  const pending = useRef<PendingFocus | null>(null);
  const ids = selected.map(({ coin }) => coin.id);
  const idsRef = useRef(ids);
  idsRef.current = ids;
  const signature = ids.join("|");

  // Después de cada cambio de la selección: si hay un foco pendiente, se coloca.
  useLayoutEffect(() => {
    const wanted = pending.current;
    const region = regionRef.current;
    if (!wanted || !region) return;
    pending.current = null;
    if (performance.now() - wanted.at > FOCUS_WINDOW_MS) return;

    // Solo si el foco estaba aquí o se quedó sin dueño: no se le quita a otra parte de la página.
    const active = document.activeElement;
    if (active && active !== document.body && !region.contains(active)) return;

    const neighbor = wanted.neighborId ? removeButtonOf(region, wanted.neighborId) : null;
    (neighbor ?? region.querySelector<HTMLElement>(`#${CSS.escape(ADD_COIN_ID)}`))?.focus();
  }, [signature]);

  const onRemove = useCallback(
    (coinId: string) => {
      const current = idsRef.current;
      const position = current.indexOf(coinId);
      if (position !== -1) {
        pending.current = {
          at: performance.now(),
          neighborId: current[position + 1] ?? current[position - 1] ?? null,
        };
      }
      remove(coinId);
    },
    [remove],
  );

  return { regionRef, onRemove };
}
