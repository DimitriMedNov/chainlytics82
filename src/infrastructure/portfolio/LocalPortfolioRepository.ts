import type { PortfolioRepository } from "@/application/portfolio/ports";
import type { KeyValueStorage, ObservableStore } from "@/application/shared/ports";
import {
  appendLocalTransaction,
  fillMissingCost,
  migrateLegacyTransactions,
  parseStoredTransactions,
  removeTransactionById,
} from "@/domain/portfolio/transactions";
import type { Transaction } from "@/domain/portfolio/types";
import { createLocalStorageStore } from "@/infrastructure/shared/localStorageStore";

const STORAGE_KEY = "chainlytics.portfolio.movimientos";
/** Clave anterior, cuando solo guardábamos cantidades sin coste. */
const LEGACY_KEY = "chainlytics.portfolio";

const EMPTY: Transaction[] = [];

/** Los movimientos guardados en este navegador, observables. */
export function createLocalPortfolioStore(
  storage: KeyValueStorage,
): ObservableStore<Transaction[]> {
  return createLocalStorageStore<Transaction[]>({
    storage,
    key: STORAGE_KEY,
    legacyKey: LEGACY_KEY,
    empty: EMPTY,
    parse: parseStoredTransactions,
    migrate: (raw) => migrateLegacyTransactions(raw, new Date().toISOString()),
  });
}

/** Portfolio sin sesión: vive en el almacén local. */
export function createLocalPortfolioRepository(
  store: ObservableStore<Transaction[]>,
): PortfolioRepository {
  return {
    async list() {
      return store.getSnapshot();
    },
    async add(tx) {
      store.update((current) => appendLocalTransaction(current, tx, Date.now()));
    },
    async setMissingCost(coinId, unitPrice) {
      store.update((current) => fillMissingCost(current, coinId, unitPrice));
    },
    async remove(id) {
      store.update((current) => removeTransactionById(current, id));
    },
  };
}
