import type { NewTransaction, Transaction } from "./types.ts";

export function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.coinId === "string" &&
    typeof item.symbol === "string" &&
    (item.kind === "compra" || item.kind === "venta") &&
    typeof item.amount === "number" &&
    Number.isFinite(item.amount) &&
    (item.unitPrice === null || typeof item.unitPrice === "number") &&
    typeof item.happenedAt === "string"
  );
}

/** Lee lo guardado con el formato actual, descartando lo que no sea un movimiento. */
export function parseStoredTransactions(raw: unknown): Transaction[] {
  return Array.isArray(raw) ? raw.filter(isTransaction) : [];
}

/**
 * Las posiciones del formato viejo no tenían precio de compra. Se convierten
 * en una compra con coste desconocido: la cantidad se conserva y el coste se
 * queda sin saber, que es la verdad. `nowIso` es la fecha que se les pone.
 */
export function migrateLegacyTransactions(raw: unknown, nowIso: string): Transaction[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const old = item as Record<string, unknown>;
    if (typeof old.id !== "string" || typeof old.amount !== "number") return [];
    return [
      {
        id: `legacy-${old.id}`,
        coinId: old.id,
        symbol: typeof old.symbol === "string" ? old.symbol.toUpperCase() : "",
        kind: "compra" as const,
        amount: old.amount,
        unitPrice: null,
        happenedAt: nowIso,
      },
    ];
  });
}

/** Añade un movimiento guardado solo en este navegador, con un id local. */
export function appendLocalTransaction(
  current: Transaction[],
  tx: NewTransaction,
  nowMs: number,
): Transaction[] {
  return [...current, { ...tx, id: `local-${nowMs}-${current.length}` }];
}

/**
 * Pone precio a los movimientos de una moneda que no lo tenían. No añade
 * nada: rellena el hueco de lo que ya estaba registrado.
 */
export function fillMissingCost(
  current: Transaction[],
  coinId: string,
  unitPrice: number,
): Transaction[] {
  return current.map((tx) =>
    tx.coinId === coinId && tx.unitPrice === null ? { ...tx, unitPrice } : tx,
  );
}

export function removeTransactionById(current: Transaction[], id: string): Transaction[] {
  return current.filter((tx) => tx.id !== id);
}
