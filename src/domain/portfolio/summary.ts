import { acumular } from "./accumulate.ts";
import type { PortfolioSummary, Position, Transaction } from "./types.ts";

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
