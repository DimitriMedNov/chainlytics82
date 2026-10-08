import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Coin } from "@/domain/market/coin";
import {
  addToSelection,
  parseSelection,
  removeFromSelection,
  resolveSelection,
  serializeSelection,
} from "@/domain/compare/selection";

const PARAMETRO = "monedas";

export interface CompareSelection {
  /** Ids tal como están en la URL (ya recortados al máximo). */
  selectedIds: string[];
  /** Las elegidas que existen en el catálogo cargado, en el orden de la selección. */
  selected: Coin[];
  add: (coinId: string) => void;
  remove: (coinId: string) => void;
}

/**
 * Qué monedas se comparan. Vive en la URL (`?monedas=bitcoin,ethereum`) para
 * que la comparación se pueda compartir tal cual.
 */
export function useCompareSelection(catalog: Coin[] | undefined): CompareSelection {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedIds = useMemo(() => parseSelection(searchParams.get(PARAMETRO)), [searchParams]);

  const selected = useMemo(() => resolveSelection(selectedIds, catalog), [selectedIds, catalog]);

  const setSelectedIds = useCallback(
    (ids: string[]) => {
      const valor = serializeSelection(ids);
      // Conservado: se sustituyen todos los parámetros de la URL, sin crear historial.
      setSearchParams(valor === null ? {} : { [PARAMETRO]: valor }, { replace: true });
    },
    [setSearchParams],
  );

  const add = (coinId: string) => {
    const siguiente = addToSelection(selectedIds, coinId);
    if (siguiente !== null) setSelectedIds(siguiente);
  };

  const remove = (coinId: string) => {
    setSelectedIds(removeFromSelection(selectedIds, coinId));
  };

  return { selectedIds, selected, add, remove };
}
