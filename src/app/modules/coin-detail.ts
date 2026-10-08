import type { BaseDeps } from "@/app/base";
import { convertFromDetail, toggleCoinWatchlist } from "@/application/coin-detail/useCases";

/**
 * Modal de detalle de moneda: casos de uso «alternar seguimiento» y
 * «convertir». No crea ningún adaptador: el histórico de precios sale de
 * `market` y la watchlist de `watchlist`, los dos compartidos, y el hook
 * `useCoinDetail` (`src/hooks/coin-detail/`) le pasa al caso de uso el puerto
 * `WatchlistTogglePort` que cumple `useWatchlist()`.
 */
export function createCoinDetailModule(_base: BaseDeps) {
  return {
    toggleWatchlist: toggleCoinWatchlist,
    convert: convertFromDetail,
  };
}
