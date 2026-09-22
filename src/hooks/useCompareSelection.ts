import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MAX_MONEDAS } from "@/hooks/useComparison";
import type { Coin } from "@/types/coin";

const POR_DEFECTO = ["bitcoin", "ethereum"];
const PARAMETRO = "monedas";

/**
 * Qué monedas se comparan. Vive en la URL (`?monedas=bitcoin,ethereum`) para
 * que la comparación se pueda compartir tal cual.
 */
export function useCompareSelection(catalog: Coin[] | undefined) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedIds = useMemo(() => {
    const crudo = searchParams.get(PARAMETRO);
    const ids = crudo === null ? POR_DEFECTO : crudo.split(",").filter(Boolean);
    return ids.slice(0, MAX_MONEDAS);
  }, [searchParams]);

  const selected = useMemo(
    () =>
      selectedIds.flatMap((id) => {
        const coin = catalog?.find((item) => item.id === id);
        return coin ? [coin] : [];
      }),
    [selectedIds, catalog],
  );

  const setSelectedIds = useCallback(
    (ids: string[]) => {
      setSearchParams(ids.length === 0 ? {} : { [PARAMETRO]: ids.join(",") }, { replace: true });
    },
    [setSearchParams],
  );

  const add = (coinId: string) => {
    if (coinId === "" || selectedIds.includes(coinId)) return;
    setSelectedIds([...selectedIds, coinId].slice(0, MAX_MONEDAS));
  };

  const remove = (coinId: string) => {
    setSelectedIds(selectedIds.filter((id) => id !== coinId));
  };

  return { selected, add, remove };
}
