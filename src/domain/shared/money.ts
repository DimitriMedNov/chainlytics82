/**
 * Dinero en dólares que puede no conocerse.
 *
 * `null` significa "no lo recuerdo": preferimos no saber un coste a
 * inventárnoslo. Todo lo que se calcule a partir de un importe desconocido
 * sigue siendo desconocido, y estas funciones lo garantizan sin tener que
 * comprobar el null a mano en cada sitio.
 */
export type UsdMaybe = number | null;

/** Crea el valor a partir de un dato sin tipar: solo vale un número finito. */
export function usdFrom(value: unknown): UsdMaybe {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function isKnownUsd(value: UsdMaybe): value is number {
  return value !== null;
}

/** Aplica un cálculo solo si el importe se conoce; si no, sigue desconocido. */
export function mapUsd(value: UsdMaybe, calc: (known: number) => number): UsdMaybe {
  return value === null ? null : calc(value);
}

/** Importe total de una operación: precio por unidad × cantidad. */
export function usdTimes(unitPrice: UsdMaybe, amount: number): UsdMaybe {
  return mapUsd(unitPrice, (price) => price * amount);
}

/** Elige qué enseñar según se conozca o no el importe ("—", "sin registrar"...). */
export function foldUsd<T>(value: UsdMaybe, onKnown: (known: number) => T, onUnknown: T): T {
  return value === null ? onUnknown : onKnown(value);
}
