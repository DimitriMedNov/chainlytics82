/** Lo que hace falta saber de las dos lecturas para decidir qué se pinta. */
export interface ScreenStateInput {
  transactionsError: boolean;
  transactionsPending: boolean;
  pricesError: boolean;
  pricesPending: boolean;
  transactionCount: number;
}

/**
 * Qué bloque toca pintar. El orden de prioridad es el de siempre: fallo de
 * movimientos, fallo de precios, cargando (cualquiera de los dos), vacío, éxito.
 */
export type ScreenState =
  | "transactions-error"
  | "prices-error"
  | "loading"
  | "empty"
  | "ready";

export function resolveScreenState(input: ScreenStateInput): ScreenState {
  if (input.transactionsError) return "transactions-error";
  if (input.pricesError) return "prices-error";
  if (input.pricesPending || input.transactionsPending) return "loading";
  if (input.transactionCount === 0) return "empty";
  return "ready";
}

/**
 * El botón "Registrar movimiento" de la cabecera se deshabilita mientras los
 * precios cargan o han fallado (sin precios no hay lista de monedas).
 */
export function canRegisterTransaction(pricesPending: boolean, pricesError: boolean): boolean {
  return !(pricesPending || pricesError);
}
