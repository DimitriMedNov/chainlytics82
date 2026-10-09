import { useEffect, useState } from "react";

const SELECTED_ROW = '[data-slot="search-result"][data-selected="true"]';

export interface SelectionHighlight {
  /** Para el `ref` de la lista (cmdk). */
  listRef: (element: HTMLDivElement | null) => void;
  /** Distancia en px de la fila seleccionada al inicio de su grupo; `null` si no hay ninguna. */
  offset: number | null;
}

/**
 * Sigue a la fila que cmdk marca como seleccionada (flechas o puntero) y da
 * su posición, para que un único resalte se deslice hasta ella con
 * `transform`. Se lee del DOM porque la selección es estado interno de cmdk.
 */
export function useSelectionHighlight(): SelectionHighlight {
  const [list, setList] = useState<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    if (!list) return;
    const measure = () => {
      const row = list.querySelector<HTMLElement>(SELECTED_ROW);
      setOffset(row ? row.offsetTop : null);
    };
    measure();

    const observer = new MutationObserver(measure);
    observer.observe(list, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-selected"],
    });
    return () => observer.disconnect();
  }, [list]);

  return { listRef: setList, offset };
}
