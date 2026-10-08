import { err, ok, type Result } from "./result.ts";

/**
 * Cantidad escrita por el usuario en un campo de texto.
 *
 * Es el mismo parseo que antes estaba repetido en el formulario de
 * movimientos, en el diálogo de coste y en el convertidor: se acepta la coma
 * decimal y se lee con `parseFloat`.
 */
export type AmountError = "not-a-number" | "not-positive" | "negative";

/** Número leído del texto; `NaN` si no hay número que leer. */
export function parseUserAmount(text: string): number {
  return Number.parseFloat(text.replace(",", "."));
}

/** Cantidad estrictamente mayor que cero (cantidades, coste, convertidor). */
export function positiveAmount(text: string): Result<number, AmountError> {
  const value = parseUserAmount(text);
  if (!Number.isFinite(value)) return err("not-a-number");
  if (value <= 0) return err("not-positive");
  return ok(value);
}

/**
 * Precio opcional: vacío significa "no lo recuerdo" (`null`); si se escribe,
 * no puede ser negativo.
 */
export function optionalNonNegativeAmount(text: string): Result<number | null, AmountError> {
  if (text.trim() === "") return ok(null);
  const value = parseUserAmount(text);
  if (!Number.isFinite(value)) return err("not-a-number");
  if (value < 0) return err("negative");
  return ok(value);
}
