import type { Coin } from "../market/coin.ts";
import { mapUsd, type UsdMaybe } from "../shared/money.ts";
import { acumular, CASI_CERO } from "./accumulate.ts";
import type { Position, Transaction } from "./types.ts";

/** Convierte los movimientos en posiciones valoradas a precio de mercado. */
// Conservado: una moneda que no esté en `coins` (el top cargado) desaparece de
// las posiciones y del valor total (inventario §9, punto 3).
export function buildPositions(
  transactions: Transaction[],
  coins: Coin[] | undefined,
): Position[] {
  if (!coins) return [];
  const acumulados = acumular(transactions);
  const posiciones: Position[] = [];

  for (const [coinId, acc] of acumulados) {
    if (acc.amount <= CASI_CERO) continue;

    const tx = transactions.find((item) => item.coinId === coinId);
    const coin = coins.find(
      (item) => item.id === coinId || item.symbol === (tx?.symbol ?? "").toUpperCase(),
    );
    if (!coin) continue;

    const value = coin.price * acc.amount;
    // Con una sola compra sin precio, el coste entero pasa a ser desconocido,
    // y todo lo que se calcula con él también.
    const avgCost: UsdMaybe = acc.costUnknown ? null : acc.cost / acc.amount;
    const invested = mapUsd(avgCost, () => acc.cost);
    const unrealizedPnl = mapUsd(invested, (known) => value - known);
    const unrealizedPnlPct =
      invested === null || invested <= 0 ? null : ((value - invested) / invested) * 100;

    posiciones.push({
      coinId,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      amount: acc.amount,
      price: coin.price,
      change24h: coin.change24h,
      value,
      avgCost,
      invested,
      unrealizedPnl,
      unrealizedPnlPct,
      realizedPnl: acc.realizedPnl,
    });
  }

  return posiciones.sort((a, b) => b.value - a.value);
}
