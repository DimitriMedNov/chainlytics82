import { useCallback } from "react";
import type { CoinLoadErrorNotice } from "@/application/search/messages";
import type { CoinSearchResult } from "@/domain/market/coin";
import { useSearch } from "@/hooks/search/useSearch";
import { useSearchPalette, type SearchPalette } from "@/hooks/search/useSearchPalette";
import { useSelectedCoin, type SelectedCoin } from "@/hooks/search/useSelectedCoin";

export interface UseGlobalSearchOptions {
  /** Se llama si no se puede cargar la moneda elegida. Quien llama enseña el aviso. */
  onCoinLoadError?: (notice: CoinLoadErrorNotice) => void;
}

export interface GlobalSearch extends SearchPalette {
  /** Si la paleta está abierta, y cómo abrirla o cerrarla (su `onOpenChange`). */
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  /** Elegir un resultado: cierra la paleta y pide abrir el detalle de esa moneda. */
  selectResult: (result: CoinSearchResult) => void;
  /** La moneda elegida y el estado del modal de detalle. */
  detail: Omit<SelectedCoin, "select">;
}

/**
 * Contenedor del buscador global: texto, resultados, estados y la moneda
 * elegida lista para el detalle. Llámalo solo desde el componente que se
 * monta tras la primera apertura (`useSearch().wasOpened`): pide el top 100.
 */
export function useGlobalSearch(options: UseGlobalSearchOptions = {}): GlobalSearch {
  const { isOpen, setOpen } = useSearch();
  const palette = useSearchPalette(isOpen);
  const { select, ...detail } = useSelectedCoin(options.onCoinLoadError);

  const selectResult = useCallback(
    (result: CoinSearchResult) => {
      select(result.id);
      setOpen(false);
    },
    [select, setOpen],
  );

  return { ...palette, isOpen, setOpen, selectResult, detail };
}
