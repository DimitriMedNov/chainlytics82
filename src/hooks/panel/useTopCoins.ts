import { useMemo } from "react";
import { toTopCoinRows, type TopCoinRow } from "@/application/panel/presentation/topCoinRows";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import type { Coin } from "@/domain/market/coin";
import { resolveBlockStatus, type BlockStatus } from "@/domain/panel/blockStatus";
import {
  TOP_COINS_VISIBLE,
  topChangeBars,
  topCoins,
  topVolumeBars,
  type TopCoinBar,
  type TopCoinChangeBar,
} from "@/domain/panel/topCoins";
import { useMarkets } from "@/hooks/market/useMarketData";

const NONE: Coin[] = [];

export interface TopCoinsState {
  status: BlockStatus;
  /** Las 5 primeras por capitalización, sin formato. */
  coins: Coin[];
  /** Las mismas, con los textos de la tabla ya formateados. */
  rows: TopCoinRow[];
  /** Barras del cambio en 24 h (%), una por moneda. */
  changeBars: TopCoinChangeBar[];
  /** Barras del volumen en 24 h (USD), una por moneda. */
  volumeBars: TopCoinBar[];
  /** Cuántas filas tiene el skeleton: 5. */
  skeletonRows: number;
  errorTitle: string;
  /** Mensaje del fallo, ya en español. "" si no hay error. */
  errorMessage: string;
  /** Vuelve a pedir. Sirve para el error y para el vacío («Volver a intentar»). */
  retry: () => void;
  isRetrying: boolean;
}

/**
 * Top 5 del Panel. Comparte la consulta de mercados con el resto de la app
 * (no pide nada nuevo) y se refresca sola cada minuto.
 */
export function useTopCoins(): TopCoinsState {
  const { data, isPending, isError, error, refetch, isFetching } = useMarkets();

  const coins = useMemo(() => (data ? topCoins(data) : NONE), [data]);
  const rows = useMemo(() => toTopCoinRows(coins), [coins]);
  const changeBars = useMemo(() => topChangeBars(coins), [coins]);
  const volumeBars = useMemo(() => topVolumeBars(coins), [coins]);

  return {
    status: resolveBlockStatus({ isPending, isError }, coins.length === 0),
    coins,
    rows,
    changeBars,
    volumeBars,
    skeletonRows: TOP_COINS_VISIBLE,
    errorTitle: PANEL_TEXTS.top.errorTitle,
    errorMessage: error?.message ?? "",
    retry: () => void refetch(),
    isRetrying: isFetching,
  };
}
