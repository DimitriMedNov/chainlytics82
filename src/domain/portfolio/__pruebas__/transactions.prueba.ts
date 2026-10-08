/**
 * Comprobaciones de los movimientos guardados: validación, migración del
 * formato antiguo y operaciones sobre la lista local. Se ejecutan con
 * `node --experimental-strip-types` sobre este archivo.
 */
import {
  appendLocalTransaction,
  fillMissingCost,
  isTransaction,
  migrateLegacyTransactions,
  parseStoredTransactions,
  removeTransactionById,
} from "../transactions.ts";
import type { Transaction } from "../types.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const compra: Transaction = {
  id: "a", coinId: "bitcoin", symbol: "BTC", kind: "compra", amount: 1,
  unitPrice: 40_000, happenedAt: "2026-01-01T12:00:00.000Z",
};
const sinPrecio: Transaction = { ...compra, id: "b", unitPrice: null };

// Validación de lo guardado
{
  check("movimiento válido", isTransaction(compra), true);
  check("precio null es válido", isTransaction(sinPrecio), true);
  check("tipo desconocido no vale", isTransaction({ ...compra, kind: "regalo" }), false);
  check("cantidad no finita no vale", isTransaction({ ...compra, amount: Number.NaN }), false);
  check("sin fecha no vale", isTransaction({ ...compra, happenedAt: undefined }), false);
  check("null no vale", isTransaction(null), false);
  check("descarta los inválidos", parseStoredTransactions([compra, { id: 1 }, null]), [compra]);
  check("no es lista -> vacío", parseStoredTransactions({}), []);
}

// Migración del formato antiguo ({id: coinId, symbol, amount}, sin coste)
{
  const ahora = "2026-10-08T10:00:00.000Z";
  const viejo = [
    { id: "bitcoin", symbol: "btc", amount: 0.5 },
    { id: "ethereum", amount: 2 },
    { id: 7, amount: 1 },
    { id: "solana" },
    null,
  ];
  check("migra como compras sin coste", migrateLegacyTransactions(viejo, ahora), [
    { id: "legacy-bitcoin", coinId: "bitcoin", symbol: "BTC", kind: "compra", amount: 0.5, unitPrice: null, happenedAt: ahora },
    { id: "legacy-ethereum", coinId: "ethereum", symbol: "", kind: "compra", amount: 2, unitPrice: null, happenedAt: ahora },
  ]);
  check("no es lista -> vacío", migrateLegacyTransactions("roto", ahora), []);
}

// Operaciones sobre la lista local
{
  const { id: _id, ...nuevo } = compra;
  const lista = appendLocalTransaction([sinPrecio], nuevo, 1_700_000_000_000);
  check("el id local lleva el instante y la posición", lista[1].id, "local-1700000000000-1");
  check("añade al final", lista.length, 2);

  const conCoste = fillMissingCost([sinPrecio, compra, { ...sinPrecio, id: "c", coinId: "ethereum" }], "bitcoin", 30_000);
  check("rellena solo los de esa moneda sin precio", conCoste.map((t) => t.unitPrice), [30_000, 40_000, null]);

  check("borra por id", removeTransactionById([compra, sinPrecio], "a").map((t) => t.id), ["b"]);
}
