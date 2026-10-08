import type { Coin } from "../../domain/market/coin.ts";
import {
  buildNewTransaction,
  type TransactionFormValues,
} from "../../domain/portfolio-screen/transactionForm.ts";
import { parseCostPrice } from "../../domain/portfolio-screen/setCost.ts";
import type { NewTransaction, Position } from "../../domain/portfolio/types.ts";
import { err, type Result } from "../../domain/shared/result.ts";
import {
  COST_PRICE_ERROR,
  costRegisteredNotice,
  TRANSACTION_FORM_ERRORS,
  TRANSACTION_REMOVED_NOTICE,
  type Notice,
} from "./messages.ts";
import type { PortfolioActionsPort } from "./ports.ts";

/**
 * Valida lo escrito en "Registrar movimiento". El error es el texto que se
 * enseña en línea; el valor, el movimiento listo para guardar.
 */
export function parseTransactionForm(
  values: TransactionFormValues,
  coins: Coin[],
): Result<NewTransaction, string> {
  const result = buildNewTransaction(values, coins);
  return result.ok ? result : err(TRANSACTION_FORM_ERRORS[result.error]);
}

/** Valida el precio escrito en "Coste de {moneda}". El error es el texto en línea. */
export function parseCostForm(unitPriceText: string): Result<number, string> {
  const result = parseCostPrice(unitPriceText);
  return result.ok ? result : err(COST_PRICE_ERROR);
}

/**
 * Registra una compra o una venta ya validada.
 */
// Conservado: registrar un movimiento no lanza ningún aviso (hoy solo se
// cierra el diálogo), por eso devuelve `null`.
export function registerTransaction(actions: PortfolioActionsPort, tx: NewTransaction): null {
  actions.addTransaction(tx);
  return null;
}

/** Borra un movimiento (sin confirmación) y devuelve el aviso a lanzar. */
// Conservado: el aviso de éxito se devuelve sin esperar a que se guarde
// (inventario §9, punto 5). El fallo se lee en `saveErrorMessage`.
export function removeTransaction(actions: PortfolioActionsPort, id: string): Notice {
  actions.removeTransaction(id);
  return TRANSACTION_REMOVED_NOTICE;
}

/**
 * Fija el coste de una posición "sin coste": rellena el precio de todos sus
 * movimientos que no lo tenían. Devuelve el aviso a lanzar.
 */
// Conservado: el aviso de éxito se devuelve sin esperar a que se guarde
// (inventario §9, punto 5). El fallo se lee en `saveErrorMessage`.
export function setPositionCost(
  actions: PortfolioActionsPort,
  position: Pick<Position, "coinId" | "name">,
  unitPrice: number,
): Notice {
  actions.setMissingCost(position.coinId, unitPrice);
  return costRegisteredNotice(position.name);
}
