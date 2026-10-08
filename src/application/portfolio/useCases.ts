import type { NewTransaction, Transaction } from "../../domain/portfolio/types.ts";
import type { PortfolioRepository } from "./ports.ts";

export function listTransactions(repository: PortfolioRepository): Promise<Transaction[]> {
  return repository.list();
}

/** Registra una compra o una venta. */
export function addTransaction(repository: PortfolioRepository, tx: NewTransaction): Promise<void> {
  return repository.add(tx);
}

/**
 * Registra el coste de una moneda que estaba "sin coste": rellena el precio
 * de sus movimientos que no lo tenían. No añade ningún movimiento.
 */
export function setMissingCost(
  repository: PortfolioRepository,
  coinId: string,
  unitPrice: number,
): Promise<void> {
  return repository.setMissingCost(coinId, unitPrice);
}

/** Borra un movimiento. */
export function removeTransaction(repository: PortfolioRepository, id: string): Promise<void> {
  return repository.remove(id);
}
