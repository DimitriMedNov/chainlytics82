import type { Result } from "../shared/result.ts";
import { positiveAmount, type AmountError } from "../shared/userAmount.ts";

/**
 * Precio por unidad escrito en el diálogo "Coste de {moneda}". Tiene que ser
 * un número mayor que cero (a diferencia del formulario de movimiento, aquí
 * no se puede dejar vacío ni poner 0).
 */
export function parseCostPrice(text: string): Result<number, AmountError> {
  return positiveAmount(text);
}

/**
 * "Invertido" en vivo: precio escrito × cantidad de la posición. `null`
 * mientras el precio no sea válido (no se enseña).
 */
export function costInvested(unitPriceText: string, positionAmount: number): number | null {
  const unitPrice = parseCostPrice(unitPriceText);
  return unitPrice.ok ? unitPrice.value * positionAmount : null;
}
