import type { Transaction } from "../../domain/portfolio/types.ts";
import type { Result } from "../../domain/shared/result.ts";
import type { WatchlistEntry } from "../../domain/watchlist/entries.ts";
import type { ObservableStore } from "../shared/ports.ts";

/** Sube a la cuenta del usuario lo que estaba guardado en el navegador. */
export interface AccountImportPort {
  /** Idempotente: una moneda que ya estuviera en la cuenta se ignora. */
  importWatchlist(userId: string, entries: WatchlistEntry[]): Promise<Result<void, string>>;
  /** NO es idempotente: subir dos veces lo mismo lo duplica. */
  importTransactions(userId: string, transactions: Transaction[]): Promise<Result<void, string>>;
}

type LocalStore<T> = Pick<ObservableStore<T>, "getSnapshot" | "replace" | "clear">;

export interface MigrateLocalDataPorts {
  localWatchlist: LocalStore<WatchlistEntry[]>;
  localTransactions: LocalStore<Transaction[]>;
  account: AccountImportPort;
}

/**
 * Al iniciar sesión, sube a la cuenta lo que estuviera guardado solo en este
 * navegador. Devuelve cuántos elementos movió (0 si no había nada o falló).
 *
 * Los movimientos no tienen clave natural, así que subirlos dos veces los
 * duplica. Para que no pase, se vacía el almacenamiento local ANTES de subir
 * (una escritura síncrona que cierra la ventana en la que dos arranques
 * simultáneos leerían lo mismo) y, si la subida falla, se devuelven a su
 * sitio.
 */
export function migrateLocalData(ports: MigrateLocalDataPorts, userId: string): Promise<number> {
  // Se toma el contenido y se vacía en el mismo tic, antes de cualquier espera.
  // Por eso esta función no es `async`: nada de aquí arriba puede aplazarse.
  const watchlist = ports.localWatchlist.getSnapshot();
  const transactions = ports.localTransactions.getSnapshot();
  if (watchlist.length === 0 && transactions.length === 0) return Promise.resolve(0);

  ports.localWatchlist.clear();
  ports.localTransactions.clear();

  return upload(ports, userId, watchlist, transactions);
}

async function upload(
  ports: MigrateLocalDataPorts,
  userId: string,
  watchlist: WatchlistEntry[],
  transactions: Transaction[],
): Promise<number> {
  let movidos = 0;

  if (watchlist.length > 0) {
    const result = await ports.account.importWatchlist(userId, watchlist);
    if (!result.ok) {
      ports.localWatchlist.replace(watchlist);
    } else {
      // Conservado: se cuentan todas aunque la cuenta ya tuviera alguna y se
      // haya ignorado (inventario §9, punto 7).
      movidos += watchlist.length;
    }
  }

  if (transactions.length > 0) {
    const result = await ports.account.importTransactions(userId, transactions);
    if (!result.ok) {
      ports.localTransactions.replace(transactions);
    } else {
      movidos += transactions.length;
    }
  }

  return movidos;
}

/** El aviso que enseña quien llama cuando se movió algo. */
export function migratedMessage(movidos: number): { title: string; description: string } {
  return {
    title: "Datos guardados en tu cuenta",
    description: `Movimos ${movidos} ${movidos === 1 ? "elemento" : "elementos"} de este navegador a tu cuenta.`,
  };
}
