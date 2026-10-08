import type { KeyValueStorage, ObservableStore } from "@/application/shared/ports";

export interface LocalStorageStoreConfig<T> {
  storage: KeyValueStorage;
  key: string;
  /** Clave de la versión anterior: se migra al leer y se borra al vaciar. */
  legacyKey: string;
  /** Valor vacío. Tiene que ser siempre la misma referencia. */
  empty: T;
  /** Interpreta lo guardado con el formato actual. */
  parse(raw: unknown): T;
  /** Convierte lo guardado con el formato antiguo. */
  migrate(raw: unknown): T;
}

/**
 * Almacén observable sobre el almacenamiento del navegador (Observer).
 *
 * Lee una sola vez y guarda el valor en memoria: todas las pantallas comparten
 * esa copia y se enteran de cada cambio, en vez de tener cada una la suya y
 * pisarse al escribir. Si el almacenamiento está bloqueado, el valor vive solo
 * en memoria.
 */
export function createLocalStorageStore<T>(config: LocalStorageStoreConfig<T>): ObservableStore<T> {
  const { storage, key, legacyKey, empty, parse, migrate } = config;
  const listeners = new Set<() => void>();
  let loaded = false;
  let current: T = empty;

  const read = (): T => {
    try {
      const stored = storage.getItem(key);
      if (stored) return parse(JSON.parse(stored) as unknown);

      const legacy = storage.getItem(legacyKey);
      if (legacy) {
        const migrated = migrate(JSON.parse(legacy) as unknown);
        storage.setItem(key, JSON.stringify(migrated));
        return migrated;
      }
    } catch {
      // Almacenamiento corrupto o bloqueado: empezamos de cero en vez de romper la vista.
    }
    return empty;
  };

  const getSnapshot = (): T => {
    if (!loaded) {
      current = read();
      loaded = true;
    }
    return current;
  };

  const commit = (next: T) => {
    current = next;
    loaded = true;
    try {
      storage.setItem(key, JSON.stringify(next));
    } catch {
      // Modo incógnito con almacenamiento bloqueado: el valor vive solo en memoria.
    }
    listeners.forEach((listener) => listener());
  };

  return {
    getSnapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    update(updater) {
      const before = getSnapshot();
      const next = updater(before);
      if (next !== before) commit(next);
    },
    replace: commit,
    clear() {
      current = empty;
      loaded = true;
      try {
        storage.removeItem(key);
        storage.removeItem(legacyKey);
      } catch {
        // Nada que hacer si el almacenamiento está bloqueado.
      }
      listeners.forEach((listener) => listener());
    },
  };
}
