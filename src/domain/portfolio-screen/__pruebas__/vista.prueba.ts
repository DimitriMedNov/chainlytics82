/**
 * Comprobaciones de lo que pinta la pantalla Portfolio: signo de la ganancia,
 * resumen, movimientos ordenados, series y estado de la vista. Se ejecutan
 * con `node --experimental-strip-types` sobre este archivo.
 */
import type { PortfolioSummary, Position, Transaction } from "../../portfolio/types.ts";
import { gainOf, hasRealizedGain, needsCost, summaryFigures } from "../gain.ts";
import { canRegisterTransaction, resolveScreenState } from "../screenState.ts";
import { distributionSeries, gainSeries, positionWeight } from "../series.ts";
import { buildTransactionRows } from "../transactionRows.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

// Signo de la ganancia
{
  check("desconocida", gainOf(null, 5), { known: false });
  check("ganancia", gainOf(12, 3), { known: true, rises: true, sign: "+", absValue: 12, value: 12, pct: 3 });
  check("cero cuenta como ganancia", gainOf(0, null), { known: true, rises: true, sign: "+", absValue: 0, value: 0, pct: null });
  check("pérdida", gainOf(-7, -2), { known: true, rises: false, sign: "−", absValue: 7, value: -7, pct: -2 });
}

const posicion = (extra: Partial<Position>): Position => ({
  coinId: "bitcoin", symbol: "BTC", name: "Bitcoin", image: "", amount: 1, price: 100,
  change24h: 0, value: 100, avgCost: 80, invested: 80, unrealizedPnl: 20,
  unrealizedPnlPct: 25, realizedPnl: 0, ...extra,
});
const sinCoste = posicion({
  coinId: "ethereum", symbol: "ETH", name: "Ethereum", value: 300, avgCost: null,
  invested: null, unrealizedPnl: null, unrealizedPnlPct: null, realizedPnl: 15,
});

// Posiciones y resumen
{
  check("con coste no pide coste", needsCost(posicion({})), false);
  check("sin coste pide coste", needsCost(sinCoste), true);
  check("realizada 0 no se enseña", hasRealizedGain(posicion({})), false);
  check("realizada distinta de 0 se enseña", hasRealizedGain(sinCoste), true);

  const resumen: PortfolioSummary = {
    value: 400, change24hValue: -4, change24hPct: -1, invested: 80, unrealizedPnl: 20,
    unrealizedPnlPct: 25, realizedPnl: -15, positionsWithoutCost: 1, best: null,
  };
  const cifras = summaryFigures(resumen);
  check("cambio 24 h negativo baja", cifras.change24hRises, false);
  check("ganancia sobre el papel", cifras.unrealized, { known: true, rises: true, sign: "+", absValue: 20, value: 20, pct: 25 });
  check("realizada sin porcentaje", cifras.realized, { known: true, rises: false, sign: "−", absValue: 15, value: -15, pct: null });
  const sinInvertido = summaryFigures({ ...resumen, invested: 0, unrealizedPnl: 0, change24hPct: 0 });
  check("sin invertido no hay ganancia", sinInvertido.unrealized, { known: false });
  check("cambio 0 cuenta como subida", sinInvertido.change24hRises, true);
}

// Movimientos
{
  const tx = (id: string, happenedAt: string, extra: Partial<Transaction> = {}): Transaction => ({
    id, coinId: "bitcoin", symbol: "BTC", kind: "compra", amount: 2, unitPrice: 10, happenedAt, ...extra,
  });
  const lista = [
    tx("viejo", "2026-01-01T12:00:00.000Z"),
    tx("nuevo", "2026-03-01T12:00:00.000Z", { kind: "venta", unitPrice: null }),
    tx("medio", "2026-02-01T12:00:00.000Z"),
  ];
  const filas = buildTransactionRows(lista);
  check("del más reciente al más antiguo", filas.map((fila) => fila.id), ["nuevo", "medio", "viejo"]);
  check("importe = cantidad × precio", filas[1].total, 20);
  check("sin precio no hay importe", filas[0].total, null);
  check("compra o venta", filas.map((fila) => fila.isBuy), [false, true, true]);
  check("no cambia la lista original", lista.map((item) => item.id), ["viejo", "nuevo", "medio"]);
}

// Series
{
  check("peso", positionWeight(100, 400), 25);
  check("total 0 -> peso 0", positionWeight(100, 0), 0);
  check("distribución, una entrada por posición", distributionSeries([sinCoste, posicion({})], 400), [
    { coinId: "ethereum", symbol: "ETH", name: "Ethereum", value: 300, weightPct: 75 },
    { coinId: "bitcoin", symbol: "BTC", name: "Bitcoin", value: 100, weightPct: 25 },
  ]);
  check("ganancia por posición", gainSeries([sinCoste, posicion({})]), [
    { coinId: "ethereum", symbol: "ETH", name: "Ethereum", unrealizedPnl: null, realizedPnl: 15 },
    { coinId: "bitcoin", symbol: "BTC", name: "Bitcoin", unrealizedPnl: 20, realizedPnl: 0 },
  ]);
}

// Estado de la vista
{
  const base = {
    transactionsError: false, transactionsPending: false, pricesError: false,
    pricesPending: false, transactionCount: 2,
  };
  check("éxito", resolveScreenState(base), "ready");
  check("vacío", resolveScreenState({ ...base, transactionCount: 0 }), "empty");
  check("cargando precios", resolveScreenState({ ...base, pricesPending: true }), "loading");
  check("cargando movimientos", resolveScreenState({ ...base, transactionsPending: true }), "loading");
  check("fallo de precios gana a cargando", resolveScreenState({ ...base, pricesError: true, transactionsPending: true }), "prices-error");
  check("fallo de movimientos gana a todo", resolveScreenState({ ...base, transactionsError: true, pricesError: true }), "transactions-error");
  check("se puede registrar", canRegisterTransaction(false, false), true);
  check("cargando precios no", canRegisterTransaction(true, false), false);
  check("precios con fallo no", canRegisterTransaction(false, true), false);
}
