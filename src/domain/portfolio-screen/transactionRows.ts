import type { Transaction } from "../portfolio/types.ts";
import { usdTimes, type UsdMaybe } from "../shared/money.ts";

/** Un movimiento listo para la lista: con su importe y si es compra. */
export interface TransactionRow extends Transaction {
  isBuy: boolean;
  /** Cantidad × precio por unidad; `null` si no se registró el precio ("—"). */
  total: UsdMaybe;
}

/** Del más reciente al más antiguo, por fecha del movimiento (no por orden de entrada). */
export function sortByDateDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime(),
  );
}

/** Historial de movimientos, ordenado y con el importe de cada uno. */
export function buildTransactionRows(transactions: Transaction[]): TransactionRow[] {
  return sortByDateDesc(transactions).map((tx) => ({
    ...tx,
    isBuy: tx.kind === "compra",
    total: usdTimes(tx.unitPrice, tx.amount),
  }));
}
