import type { NewTransaction, Transaction } from "../../domain/portfolio/types.ts";

/**
 * Dónde viven los movimientos del portfolio. Igual que la watchlist, tiene
 * dos implementaciones intercambiables (Strategy): este navegador y la cuenta.
 *
 * Los métodos lanzan `RepositoryError` si el almacenamiento falla.
 */
export interface PortfolioRepository {
  list(): Promise<Transaction[]>;
  add(tx: NewTransaction): Promise<void>;
  /** Pone precio a los movimientos de esa moneda que no lo tenían. */
  setMissingCost(coinId: string, unitPrice: number): Promise<void>;
  remove(id: string): Promise<void>;
}
