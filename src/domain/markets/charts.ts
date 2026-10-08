import type { Coin } from "../market/coin.ts";
import { isRising } from "./filters.ts";

/** Una barra de la gráfica "cambio en 24 h" de las monedas visibles. */
export interface ChangeBar {
  id: string;
  symbol: string;
  name: string;
  /** Cambio en 24 h, en puntos porcentuales (2.5 = +2,5 %). */
  change24h: number;
  /** Mismo criterio de color que la fila del listado (`isRising`). */
  rising: boolean;
}

/**
 * Barras de cambio en 24 h, en el mismo orden que la lista recibida (la ya
 * filtrada y ordenada). `limit` recorta a las primeras N; sin él, todas.
 */
export function buildChangeBars(coins: Coin[], limit?: number): ChangeBar[] {
  const shown = limit === undefined ? coins : coins.slice(0, Math.max(0, limit));
  return shown.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    change24h: coin.change24h,
    rising: isRising(coin),
  }));
}

export type TrendKey = "up" | "down" | "flat";

/** Un trozo del reparto suben / bajan / sin cambio. */
export interface TrendSlice {
  key: TrendKey;
  count: number;
  /** Parte del total, de 0 a 100. 0 si la lista está vacía. */
  share: number;
}

/** Hacia dónde va una moneda: aquí el 0 exacto es "sin cambio", no subida. */
export function trendOf(coin: Pick<Coin, "change24h">): TrendKey {
  if (coin.change24h > 0) return "up";
  if (coin.change24h < 0) return "down";
  return "flat";
}

/**
 * Reparto de la lista recibida en suben / bajan / sin cambio. Devuelve
 * siempre los tres trozos, en ese orden, aunque alguno tenga 0 monedas.
 */
export function buildTrendBreakdown(coins: Coin[]): TrendSlice[] {
  const counts: Record<TrendKey, number> = { up: 0, down: 0, flat: 0 };
  for (const coin of coins) counts[trendOf(coin)] += 1;
  const total = coins.length;
  const keys: TrendKey[] = ["up", "down", "flat"];
  return keys.map((key) => ({
    key,
    count: counts[key],
    share: total === 0 ? 0 : (counts[key] / total) * 100,
  }));
}
