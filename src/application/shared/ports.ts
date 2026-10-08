/**
 * Almacén observable: guarda un valor y avisa a quien se haya suscrito cada
 * vez que cambia. Todas las pantallas que lo leen ven siempre lo mismo.
 * Encaja tal cual con `useSyncExternalStore` de React.
 */
export interface ObservableStore<T> {
  /** Valor actual. Devuelve la misma referencia mientras no cambie. */
  getSnapshot(): T;
  /** Devuelve la función para dejar de escuchar. */
  subscribe(listener: () => void): () => void;
  /** Calcula el valor nuevo a partir del actual. Si devuelve el mismo, no pasa nada. */
  update(updater: (current: T) => T): void;
  replace(next: T): void;
  /** Vuelve al valor vacío y borra lo guardado. */
  clear(): void;
}

/** Almacenamiento clave → texto del navegador. Sus métodos pueden lanzar si está bloqueado. */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
