import { useCallback, useMemo } from "react";
import {
  presentCoinDetail,
  type CoinDetailView,
} from "@/application/coin-detail/presentation/coinDetailView";
import type { ConvertOutcome, WatchlistToggleOutcome } from "@/application/coin-detail/useCases";
import { useDeps } from "@/app/deps";
import { coinDetailFigures, type CoinDetailFigures } from "@/domain/coin-detail/figures";
import type { Coin } from "@/domain/market/coin";
import { useCoinDetailChart, type CoinDetailChart } from "@/hooks/coin-detail/useCoinDetailChart";
import { useWatchlist } from "@/hooks/watchlist/useWatchlist";

export interface CoinDetail {
  /** Todo lo que se escribe de la moneda, ya formateado; `null` sin moneda. */
  view: CoinDetailView | null;
  /** Cifras para barras (rango de 24 h, capitalización/FDV, oferta); `null` sin moneda. */
  figures: CoinDetailFigures | null;
  chart: CoinDetailChart;
  /** Si la moneda está en la watchlist (se compara por símbolo). */
  isInWatchlist: boolean;
  /** `true` mientras se guarda un cambio de la watchlist. */
  isSaving: boolean;
  /** Texto del último cambio que no se pudo guardar; `""` si no hay. */
  saveErrorMessage: string;
  clearSaveError: () => void;
  /** Añade o quita y devuelve el aviso que enseñar; `null` sin moneda. */
  toggleWatchlist: () => WatchlistToggleOutcome | null;
  /** Devuelve la ruta a la que navegar (y el aviso, si lo hubiera). */
  convert: () => ConvertOutcome;
}

/**
 * Todo lo que necesita el modal de detalle de una moneda. Sustituye a la
 * lógica de `CryptoDetailsModal.tsx` y de `components/crypto/*`.
 *
 * Conservado: `coin` es la copia que guarda quien abre el modal; su precio no
 * se refresca mientras está abierto (inventario §9 nº 26).
 */
export function useCoinDetail(coin: Coin | null, open: boolean): CoinDetail {
  const { coinDetail } = useDeps();
  const { has, add, remove, isSaving, saveErrorMessage, clearSaveError } = useWatchlist();
  const chart = useCoinDetailChart(coin?.id, open);

  const view = useMemo(() => (coin ? presentCoinDetail(coin) : null), [coin]);
  const figures = useMemo(() => (coin ? coinDetailFigures(coin) : null), [coin]);

  const toggleWatchlist = useCallback(() => {
    if (!coin) return null;
    return coinDetail.toggleWatchlist({ has, add, remove }, coin);
  }, [coinDetail, coin, has, add, remove]);

  const convert = useCallback(() => coinDetail.convert(), [coinDetail]);

  return {
    view,
    figures,
    chart,
    isInWatchlist: coin ? has(coin.symbol) : false,
    isSaving,
    saveErrorMessage,
    clearSaveError,
    toggleWatchlist,
    convert,
  };
}
