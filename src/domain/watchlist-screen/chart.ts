import type { WatchlistCoin } from "../watchlist/entries.ts";

/** Una barra de la gráfica «cambio en 24 h». */
export interface Change24hBar {
  /** Id de la moneda: clave estable para la lista. */
  id: string;
  symbol: string;
  name: string;
  /** Variación en 24 h, en puntos porcentuales (2.5 = +2,5 %). */
  change24h: number;
  /** Misma regla que la fila: 0 cuenta como subida. */
  isUp: boolean;
  isFavorite: boolean;
}

/** La misma regla de color que usa la fila (`change24h >= 0`). */
export function isUp(change24h: number): boolean {
  return change24h >= 0;
}

/**
 * Serie para la gráfica de barras de la pantalla, en el orden recibido.
 * No pide nada: usa lo que ya está cargado.
 */
export function change24hSeries(coins: WatchlistCoin[]): Change24hBar[] {
  return coins.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    change24h: coin.change24h,
    isUp: isUp(coin.change24h),
    isFavorite: coin.isFavorite,
  }));
}
