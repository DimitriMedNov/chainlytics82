import type { Coin } from "../market/coin.ts";

/** Monedas que enseña el Panel: las primeras del top por capitalización. */
export const TOP_COINS_VISIBLE = 5;

/** Regla «top 5»: las primeras de la lista, que ya llega ordenada por capitalización. */
export function topCoins(coins: readonly Coin[]): Coin[] {
  return coins.slice(0, TOP_COINS_VISIBLE);
}

/**
 * Una cifra «sube» si su cambio es cero o positivo (flecha arriba y color de
 * subida); solo «baja» con cambio negativo.
 */
export function isRising(changePct: number): boolean {
  return changePct >= 0;
}

/** Una barra de la gráfica del top: una moneda y su valor. */
export interface TopCoinBar {
  id: string;
  symbol: string;
  name: string;
  value: number;
}

/** Barra de cambio en 24 h: además dice si sube, para elegir color. */
export interface TopCoinChangeBar extends TopCoinBar {
  rising: boolean;
}

/** Barras del cambio en 24 h (en %), en el mismo orden que la tabla. */
export function topChangeBars(coins: readonly Coin[]): TopCoinChangeBar[] {
  return coins.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    value: coin.change24h,
    rising: isRising(coin.change24h),
  }));
}

/** Barras del volumen en 24 h (en USD), en el mismo orden que la tabla. */
export function topVolumeBars(coins: readonly Coin[]): TopCoinBar[] {
  return coins.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    value: coin.volume24h,
  }));
}
