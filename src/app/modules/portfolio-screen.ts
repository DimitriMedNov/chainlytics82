import type { BaseDeps } from "@/app/base";
import {
  parseCostForm,
  parseTransactionForm,
  registerTransaction,
  removeTransaction,
  setPositionCost,
} from "@/application/portfolio-screen/useCases";

/**
 * Portfolio (/portfolio): casos de uso propios de la pantalla. No crea
 * adaptadores: guarda a través de las acciones de `usePortfolio()`, que el
 * hook `usePortfolioScreen` entrega como `PortfolioActionsPort`.
 * Llega a los hooks con `useDeps().portfolioScreen`.
 */
export interface PortfolioScreenModule {
  parseTransactionForm: typeof parseTransactionForm;
  parseCostForm: typeof parseCostForm;
  registerTransaction: typeof registerTransaction;
  removeTransaction: typeof removeTransaction;
  setPositionCost: typeof setPositionCost;
}

export function createPortfolioScreenModule(_base: BaseDeps): PortfolioScreenModule {
  return {
    parseTransactionForm,
    parseCostForm,
    registerTransaction,
    removeTransaction,
    setPositionCost,
  };
}
