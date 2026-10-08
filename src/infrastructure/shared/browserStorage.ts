import type { KeyValueStorage } from "@/application/shared/ports";

/**
 * `localStorage` del navegador. Se accede en cada llamada y no al crear el
 * objeto: con el almacenamiento bloqueado, el simple acceso ya lanza, y así
 * quien llama lo captura donde le toca.
 */
export const browserStorage: KeyValueStorage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
};
