import type { Transaction } from "./types.ts";

/** Por debajo de esto consideramos que la posición está cerrada. */
export const CASI_CERO = 1e-12;

export interface Acumulado {
  amount: number;
  /** Coste total que sigue dentro de la posición. */
  cost: number;
  /** true en cuanto una compra llega sin precio: el coste deja de ser fiable. */
  costUnknown: boolean;
  realizedPnl: number;
}

/**
 * Recorre los movimientos en orden y aplica coste medio ponderado: cada
 * compra sube la cantidad y el coste; cada venta retira cantidad al coste
 * medio del momento y materializa la diferencia.
 */
export function acumular(transactions: Transaction[]): Map<string, Acumulado> {
  const porMoneda = new Map<string, Acumulado>();

  const ordenadas = [...transactions].sort(
    (a, b) => new Date(a.happenedAt).getTime() - new Date(b.happenedAt).getTime(),
  );

  for (const tx of ordenadas) {
    const actual = porMoneda.get(tx.coinId) ?? {
      amount: 0,
      cost: 0,
      costUnknown: false,
      realizedPnl: 0,
    };

    if (tx.kind === "compra") {
      actual.amount += tx.amount;
      if (tx.unitPrice === null) {
        actual.costUnknown = true;
      } else {
        actual.cost += tx.amount * tx.unitPrice;
      }
      porMoneda.set(tx.coinId, actual);
      continue;
    }

    // Venta: no se puede vender más de lo que hay.
    const vendida = Math.min(tx.amount, actual.amount);
    const costeMedio = actual.amount > CASI_CERO ? actual.cost / actual.amount : 0;

    if (!actual.costUnknown && tx.unitPrice !== null) {
      actual.realizedPnl += (tx.unitPrice - costeMedio) * vendida;
    }

    actual.cost -= costeMedio * vendida;
    actual.amount -= vendida;
    if (actual.amount <= CASI_CERO) {
      actual.amount = 0;
      actual.cost = 0;
    }
    porMoneda.set(tx.coinId, actual);
  }

  return porMoneda;
}
