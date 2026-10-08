import type { NewTransaction } from "../../domain/portfolio/types.ts";

/**
 * Las tres acciones que la pantalla Portfolio necesita de fuera. Las cumple
 * `usePortfolio()` (que a su vez guarda en el navegador o en la cuenta).
 *
 * No devuelven nada: lanzan el guardado y siguen. El resultado del guardado
 * se lee aparte (`isSaving`, `saveErrorMessage`).
 */
export interface PortfolioActionsPort {
  addTransaction(tx: NewTransaction): void;
  removeTransaction(id: string): void;
  setMissingCost(coinId: string, unitPrice: number): void;
}
