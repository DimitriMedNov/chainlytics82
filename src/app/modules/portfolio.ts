import type { PortfolioRepository } from "@/application/portfolio/ports";
import {
  addTransaction,
  listTransactions,
  removeTransaction,
  setMissingCost,
} from "@/application/portfolio/useCases";
import type { KeyValueStorage, ObservableStore } from "@/application/shared/ports";
import type { Transaction } from "@/domain/portfolio/types";
import {
  createLocalPortfolioRepository,
  createLocalPortfolioStore,
} from "@/infrastructure/portfolio/LocalPortfolioRepository";
import { createSupabasePortfolioRepository } from "@/infrastructure/portfolio/SupabasePortfolioRepository";
import { supabase } from "@/integrations/supabase/client";

export interface PortfolioModule {
  /** Los movimientos de este navegador, observables (los usa también la sincronización). */
  local: ObservableStore<Transaction[]>;
  /**
   * Factory: entrega el repositorio que toca. Sin sesión (`null`), el de este
   * navegador; con sesión, el de la cuenta de ese usuario.
   */
  repositoryFor(userId: string | null): PortfolioRepository;
  list: typeof listTransactions;
  add: typeof addTransaction;
  setMissingCost: typeof setMissingCost;
  remove: typeof removeTransaction;
}

export function createPortfolioModule(storage: KeyValueStorage): PortfolioModule {
  const local = createLocalPortfolioStore(storage);
  const localRepository = createLocalPortfolioRepository(local);

  return {
    local,
    repositoryFor: (userId) =>
      userId === null ? localRepository : createSupabasePortfolioRepository(supabase, userId),
    list: listTransactions,
    add: addTransaction,
    setMissingCost,
    remove: removeTransaction,
  };
}
