/**
 * Comprobaciones del cálculo de coste y ganancia. Se ejecutan con
 * `npm run test:portfolio`, usando el TypeScript nativo de Node: no hace
 * falta instalar ningún runner.
 *
 * Los casos difíciles están a propósito: coste desconocido que no debe
 * contaminar los totales, posiciones cerradas, ventas mayores que el saldo
 * y movimientos desordenados.
 */
import { buildPositions, summarize } from "../portfolioMath.ts";
import type { Transaction } from "../../types/portfolio.ts";

const coins = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", image: "", price: 100_000, change24h: 10,
    rank: 1, change7d: null, marketCap: 0, volume24h: 0, high24h: 0, low24h: 0, ath: 0,
    athChangePct: 0, atl: 0, circulatingSupply: 0, totalSupply: null, fdv: null },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", image: "", price: 2_000, change24h: 0,
    rank: 2, change7d: null, marketCap: 0, volume24h: 0, high24h: 0, low24h: 0, ath: 0,
    athChangePct: 0, atl: 0, circulatingSupply: 0, totalSupply: null, fdv: null },
];

const tx = (o: Partial<Transaction> & Pick<Transaction,"coinId"|"kind"|"amount">): Transaction => ({
  id: Math.random().toString(), symbol: o.coinId === "bitcoin" ? "BTC" : "ETH",
  unitPrice: null, happenedAt: "2026-01-01T00:00:00Z", ...o,
});

function check(nombre: string, real: unknown, esperado: unknown) {
  const ok = Math.abs(Number(real) - Number(esperado)) < 0.01 || real === esperado;
  console.log(`${ok ? "✓" : "✗ FALLA"} ${nombre}: ${real} (esperado ${esperado})`);
  if (!ok) process.exitCode = 1;
}

// Caso 1: dos compras a distinto precio -> coste medio ponderado
{
  const txs = [
    tx({ coinId: "bitcoin", kind: "compra", amount: 1, unitPrice: 40_000, happenedAt: "2026-01-01T00:00:00Z" }),
    tx({ coinId: "bitcoin", kind: "compra", amount: 1, unitPrice: 60_000, happenedAt: "2026-02-01T00:00:00Z" }),
  ];
  const p = buildPositions(txs, coins)[0];
  check("coste medio", p.avgCost, 50_000);
  check("invertido", p.invested, 100_000);
  check("valor actual", p.value, 200_000);
  check("ganancia no realizada", p.unrealizedPnl, 100_000);
  check("ganancia %", p.unrealizedPnlPct, 100);
}

// Caso 2: compra y venta parcial -> ganancia realizada contra el coste medio
{
  const txs = [
    tx({ coinId: "bitcoin", kind: "compra", amount: 2, unitPrice: 50_000, happenedAt: "2026-01-01T00:00:00Z" }),
    tx({ coinId: "bitcoin", kind: "venta",  amount: 1, unitPrice: 80_000, happenedAt: "2026-03-01T00:00:00Z" }),
  ];
  const ps = buildPositions(txs, coins);
  check("queda 1 BTC", ps[0].amount, 1);
  check("realizada = (80k-50k)*1", ps[0].realizedPnl, 30_000);
  check("invertido restante", ps[0].invested, 50_000);
  const s = summarize(ps, txs);
  check("resumen realizada", s.realizedPnl, 30_000);
}

// Caso 3: posición cerrada del todo -> no aparece, pero su ganancia cuenta
{
  const txs = [
    tx({ coinId: "ethereum", kind: "compra", amount: 10, unitPrice: 1_000, happenedAt: "2026-01-01T00:00:00Z" }),
    tx({ coinId: "ethereum", kind: "venta",  amount: 10, unitPrice: 1_500, happenedAt: "2026-02-01T00:00:00Z" }),
  ];
  const ps = buildPositions(txs, coins);
  check("sin posiciones abiertas", ps.length, 0);
  check("realizada de la cerrada", summarize(ps, txs).realizedPnl, 5_000);
}

// Caso 4: compra sin precio -> coste desconocido, nada inventado
{
  const txs = [
    tx({ coinId: "bitcoin", kind: "compra", amount: 1, unitPrice: null }),
    tx({ coinId: "bitcoin", kind: "compra", amount: 1, unitPrice: 60_000, happenedAt: "2026-02-01T00:00:00Z" }),
  ];
  const p = buildPositions(txs, coins)[0];
  check("coste desconocido", p.avgCost, null);
  check("invertido desconocido", p.invested, null);
  check("ganancia desconocida", p.unrealizedPnl, null);
  const s = summarize([p], txs);
  check("posiciones sin coste", s.positionsWithoutCost, 1);
  check("invertido total excluye la desconocida", s.invested, 0);
}

// Caso 5: los totales mezclan conocido y desconocido sin contaminarse
{
  const txs = [
    tx({ coinId: "bitcoin",  kind: "compra", amount: 1, unitPrice: null }),
    tx({ coinId: "ethereum", kind: "compra", amount: 10, unitPrice: 1_000, happenedAt: "2026-02-01T00:00:00Z" }),
  ];
  const ps = buildPositions(txs, coins);
  const s = summarize(ps, txs);
  check("valor total (sí suma todo)", s.value, 100_000 + 20_000);
  check("invertido (solo ETH)", s.invested, 10_000);
  check("ganancia (solo ETH)", s.unrealizedPnl, 10_000);
  check("ganancia % (solo ETH)", s.unrealizedPnlPct, 100);
}

// Caso 6: venta mayor que lo que hay -> se limita, no queda cantidad negativa
{
  const txs = [
    tx({ coinId: "bitcoin", kind: "compra", amount: 1, unitPrice: 50_000, happenedAt: "2026-01-01T00:00:00Z" }),
    tx({ coinId: "bitcoin", kind: "venta",  amount: 5, unitPrice: 70_000, happenedAt: "2026-02-01T00:00:00Z" }),
  ];
  const ps = buildPositions(txs, coins);
  check("no quedan posiciones", ps.length, 0);
  check("realizada solo por lo que había", summarize(ps, txs).realizedPnl, 20_000);
}

// Caso 7: el orden de entrada no importa, manda la fecha
{
  const txs = [
    tx({ coinId: "bitcoin", kind: "venta",  amount: 1, unitPrice: 80_000, happenedAt: "2026-03-01T00:00:00Z" }),
    tx({ coinId: "bitcoin", kind: "compra", amount: 2, unitPrice: 50_000, happenedAt: "2026-01-01T00:00:00Z" }),
  ];
  const p = buildPositions(txs, coins)[0];
  check("queda 1 tras ordenar por fecha", p.amount, 1);
  check("realizada correcta", p.realizedPnl, 30_000);
}
