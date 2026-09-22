import type { Coin } from "@/types/coin";
import type { PortfolioSummary, Position, Transaction } from "@/types/portfolio";

/** Por debajo de esto consideramos que la posición está cerrada. */
const CASI_CERO = 1e-12;

interface Acumulado {
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
function acumular(transactions: Transaction[]): Map<string, Acumulado> {
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

/** Convierte los movimientos en posiciones valoradas a precio de mercado. */
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
    const avgCost = acc.costUnknown ? null : acc.cost / acc.amount;
    const invested = avgCost === null ? null : acc.cost;
    const unrealizedPnl = invested === null ? null : value - invested;
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

/** Totales del portfolio, dejando fuera lo que no se puede calcular. */
export function summarize(positions: Position[], transactions: Transaction[]): PortfolioSummary {
  const value = positions.reduce((sum, p) => sum + p.value, 0);

  // Para el cambio de 24 h deshacemos el porcentaje de cada moneda y vemos
  // cuánto valía ayer lo mismo que hoy tenemos.
  const valorAyer = positions.reduce((sum, p) => {
    const factor = 1 + p.change24h / 100;
    return sum + (factor > 0 ? p.value / factor : p.value);
  }, 0);

  const conCoste = positions.filter((p) => p.invested !== null);
  const invested = conCoste.reduce((sum, p) => sum + (p.invested ?? 0), 0);
  const valorConCoste = conCoste.reduce((sum, p) => sum + p.value, 0);
  const unrealizedPnl = valorConCoste - invested;

  // La ganancia realizada incluye también las posiciones ya cerradas, que no
  // aparecen en `positions` porque su cantidad es cero.
  const realizedPnl = [...acumular(transactions).values()].reduce(
    (sum, acc) => sum + acc.realizedPnl,
    0,
  );

  const change24hValue = value - valorAyer;

  return {
    value,
    change24hValue,
    change24hPct: valorAyer > 0 ? (change24hValue / valorAyer) * 100 : 0,
    invested,
    unrealizedPnl,
    unrealizedPnlPct: invested > 0 ? (unrealizedPnl / invested) * 100 : 0,
    realizedPnl,
    positionsWithoutCost: positions.length - conCoste.length,
    best: positions.reduce<Position | null>(
      (mejor, p) => (mejor === null || p.change24h > mejor.change24h ? p : mejor),
      null,
    ),
  };
}
