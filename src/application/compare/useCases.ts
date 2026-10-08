import type { Coin, PricePoint } from "../../domain/market/coin.ts";
import {
  compareSeries,
  EMPTY_COMPARISON,
  type Comparison,
  type Series,
} from "../../domain/compare/series.ts";

/**
 * Compara las monedas elegidas con los históricos que ya hayan llegado.
 * `histories[i]` es el histórico de `coins[i]`, o `undefined` si aún no está:
 * esa moneda se deja fuera del cruce hasta que llegue.
 */
export function compareCoins(
  coins: Coin[],
  histories: ReadonlyArray<PricePoint[] | undefined>,
  days: number,
): Comparison {
  if (coins.length === 0) return EMPTY_COMPARISON;

  const series: Series[] = coins.flatMap((coin, index) => {
    const puntos = histories[index];
    return puntos ? [{ coinId: coin.id, symbol: coin.symbol, points: puntos }] : [];
  });

  return compareSeries(series, days);
}
