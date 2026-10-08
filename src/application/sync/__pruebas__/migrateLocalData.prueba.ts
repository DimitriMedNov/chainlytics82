/**
 * Comprobaciones de "migrar datos locales a la cuenta": el orden exacto de
 * los pasos (vaciar antes de esperar), la devolución si falla y el recuento.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { Transaction } from "../../../domain/portfolio/types.ts";
import { err, ok, type Result } from "../../../domain/shared/result.ts";
import type { WatchlistEntry } from "../../../domain/watchlist/entries.ts";
import { migratedMessage, migrateLocalData, type MigrateLocalDataPorts } from "../migrateLocalData.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

function memoria<T>(inicial: T[]) {
  let valor = inicial;
  return {
    getSnapshot: () => valor,
    replace: (next: T[]) => void (valor = next),
    clear: () => void (valor = []),
  };
}

const entrada: WatchlistEntry = { id: "bitcoin", symbol: "BTC", isFavorite: false };
const movimiento: Transaction = {
  id: "local-1", coinId: "bitcoin", symbol: "BTC", kind: "compra", amount: 1,
  unitPrice: null, happenedAt: "2026-01-01T12:00:00.000Z",
};

function montar(opciones: { watchlist?: WatchlistEntry[]; txs?: Transaction[]; fallaWatchlist?: boolean; fallaTxs?: boolean }) {
  const pasos: string[] = [];
  const localWatchlist = memoria(opciones.watchlist ?? []);
  const localTransactions = memoria(opciones.txs ?? []);
  const responder = (falla: boolean | undefined): Result<void, string> => (falla ? err("sin red") : ok(undefined));
  const ports: MigrateLocalDataPorts = {
    localWatchlist,
    localTransactions,
    account: {
      async importWatchlist(userId, entries) {
        pasos.push(`sube watchlist(${entries.length}) de ${userId}; local=${localWatchlist.getSnapshot().length}`);
        return responder(opciones.fallaWatchlist);
      },
      async importTransactions(userId, transactions) {
        pasos.push(`sube movimientos(${transactions.length}) de ${userId}; local=${localTransactions.getSnapshot().length}`);
        return responder(opciones.fallaTxs);
      },
    },
  };
  return { ports, pasos, localWatchlist, localTransactions };
}

// Nada que mover: no se llama a la cuenta
{
  const { ports, pasos } = montar({});
  check("sin datos mueve 0", await migrateLocalData(ports, "u1"), 0);
  check("sin datos no sube nada", pasos, []);
}

// Lo local se vacía en el mismo tic, antes de cualquier espera
{
  const { ports, pasos, localWatchlist, localTransactions } = montar({ watchlist: [entrada], txs: [movimiento, movimiento] });
  const pendiente = migrateLocalData(ports, "u1");
  check("vaciado antes de esperar", [localWatchlist.getSnapshot().length, localTransactions.getSnapshot().length], [0, 0]);

  // Un segundo arranque simultáneo ya no encuentra nada que subir.
  check("un segundo arranque mueve 0", await migrateLocalData(ports, "u1"), 0);

  check("mueve 3 elementos", await pendiente, 3);
  check("primero watchlist y luego movimientos, con lo local ya vacío", pasos, [
    "sube watchlist(1) de u1; local=0",
    "sube movimientos(2) de u1; local=0",
  ]);
}

// Falla la watchlist: se devuelve a su sitio y los movimientos sí suben
{
  const { ports, localWatchlist, localTransactions } = montar({ watchlist: [entrada], txs: [movimiento], fallaWatchlist: true });
  check("solo cuenta lo que subió", await migrateLocalData(ports, "u1"), 1);
  check("la watchlist vuelve al navegador", localWatchlist.getSnapshot(), [entrada]);
  check("los movimientos ya no están en el navegador", localTransactions.getSnapshot(), []);
}

// Fallan los movimientos: vuelven al navegador
{
  const { ports, localTransactions } = montar({ txs: [movimiento], fallaTxs: true });
  check("si todo falla mueve 0", await migrateLocalData(ports, "u1"), 0);
  check("los movimientos vuelven al navegador", localTransactions.getSnapshot(), [movimiento]);
}

// El aviso
check("aviso en singular", migratedMessage(1), { title: "Datos guardados en tu cuenta", description: "Movimos 1 elemento de este navegador a tu cuenta." });
check("aviso en plural", migratedMessage(3).description, "Movimos 3 elementos de este navegador a tu cuenta.");
