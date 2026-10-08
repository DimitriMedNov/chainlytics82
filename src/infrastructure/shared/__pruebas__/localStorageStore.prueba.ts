/**
 * Comprobaciones del almacén local observable con un almacenamiento de
 * mentira: lectura, migración de la clave antigua, avisos a los suscritos,
 * vaciado y almacenamiento bloqueado. Se ejecutan con
 * `node --experimental-strip-types` sobre este archivo.
 */
import {
  addEntry,
  migrateLegacyWatchlist,
  parseStoredWatchlist,
  type WatchlistEntry,
} from "../../../domain/watchlist/entries.ts";
import { createLocalStorageStore } from "../localStorageStore.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const KEY = "chainlytics.watchlist";
const LEGACY = "crypto-watchlist";
const EMPTY: WatchlistEntry[] = [];

function fakeStorage(inicial: Record<string, string> = {}) {
  const data = new Map(Object.entries(inicial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      data.set(key, value);
    },
    removeItem: (key: string): void => {
      data.delete(key);
    },
  };
}

const crear = (storage: ReturnType<typeof fakeStorage>) =>
  createLocalStorageStore<WatchlistEntry[]>({
    storage, key: KEY, legacyKey: LEGACY, empty: EMPTY,
    parse: parseStoredWatchlist, migrate: migrateLegacyWatchlist,
  });

const btc: WatchlistEntry = { id: "bitcoin", symbol: "BTC", isFavorite: false };

// Sin nada guardado
{
  const storage = fakeStorage();
  const store = crear(storage);
  check("empieza vacío", store.getSnapshot(), []);
  check("la misma referencia mientras no cambie", store.getSnapshot() === store.getSnapshot(), true);
  check("leer no escribe nada", storage.data.size, 0);
}

// Formato actual
{
  const store = crear(fakeStorage({ [KEY]: JSON.stringify([btc, { roto: true }]) }));
  check("lee lo guardado y descarta lo inválido", store.getSnapshot(), [btc]);
}

// Formato antiguo: se migra y se guarda ya con la clave nueva
{
  const storage = fakeStorage({ [LEGACY]: JSON.stringify([{ id: 1, symbol: "eth", price: 9 }]) });
  const store = crear(storage);
  const esperado = [{ id: "", symbol: "ETH", isFavorite: false }];
  check("migra el formato antiguo", store.getSnapshot(), esperado);
  check("deja escrita la clave nueva", JSON.parse(storage.data.get(KEY) ?? "null"), esperado);
  check("la clave antigua sigue hasta vaciar", storage.data.has(LEGACY), true);
}

// La clave nueva manda sobre la antigua
{
  const store = crear(fakeStorage({ [KEY]: JSON.stringify([btc]), [LEGACY]: JSON.stringify([{ symbol: "eth" }]) }));
  check("con clave nueva no se migra", store.getSnapshot(), [btc]);
}

// JSON corrupto
{
  const store = crear(fakeStorage({ [KEY]: "{no es json" }));
  check("corrupto -> vacío", store.getSnapshot(), []);
}

// Observadores: dos suscritos ven el mismo cambio (el bug de las copias que se pisaban)
{
  const storage = fakeStorage();
  const store = crear(storage);
  let avisosA = 0;
  let avisosB = 0;
  const dejarA = store.subscribe(() => avisosA++);
  store.subscribe(() => avisosB++);

  store.update((actual) => addEntry(actual, btc));
  check("los dos suscritos reciben el aviso", [avisosA, avisosB], [1, 1]);
  check("el cambio queda en memoria", store.getSnapshot(), [btc]);
  check("y guardado", JSON.parse(storage.data.get(KEY) ?? "null"), [btc]);

  store.update((actual) => addEntry(actual, btc));
  check("un cambio que no cambia nada no avisa", [avisosA, avisosB], [1, 1]);

  dejarA();
  store.replace([]);
  check("quien se da de baja deja de recibir", [avisosA, avisosB], [1, 2]);

  store.replace([btc]);
  store.clear();
  check("vaciar deja la lista vacía", store.getSnapshot(), []);
  check("vaciar borra las dos claves", [storage.data.has(KEY), storage.data.has(LEGACY)], [false, false]);
  check("vaciar avisa", avisosB, 4);
}

// Almacenamiento bloqueado: todo lanza, pero la lista vive en memoria
{
  const bloqueado = {
    data: new Map<string, string>(),
    getItem: (): string | null => { throw new Error("bloqueado"); },
    setItem: (): void => { throw new Error("bloqueado"); },
    removeItem: (): void => { throw new Error("bloqueado"); },
  };
  const store = crear(bloqueado);
  check("bloqueado empieza vacío", store.getSnapshot(), []);
  store.update((actual) => addEntry(actual, btc));
  check("bloqueado guarda en memoria", store.getSnapshot(), [btc]);
  store.clear();
  check("bloqueado se puede vaciar", store.getSnapshot(), []);
}
