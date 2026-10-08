import type { Coin } from "../market/coin.ts";
import type { NewTransaction } from "../portfolio/types.ts";
import { err, ok, type Result } from "../shared/result.ts";
import { optionalNonNegativeAmount, parseUserAmount, positiveAmount } from "../shared/userAmount.ts";

export type TransactionKind = "compra" | "venta";

/** Lo que hay escrito en el formulario de "Registrar movimiento", tal cual. */
export interface TransactionFormValues {
  kind: TransactionKind;
  /** Id de la moneda elegida; "" si aún no se ha elegido. */
  coinId: string;
  amount: string;
  unitPrice: string;
  /** Fecha en el formato de un `<input type="date">`: "AAAA-MM-DD". */
  date: string;
}

/** Motivos por los que el formulario no vale, en el orden en que se comprueban. */
export type TransactionFormError = "no-coin" | "invalid-amount" | "invalid-price";

/** Hoy en hora local con el formato de un `<input type="date">`. */
export function todayAsInputDate(now: Date): string {
  const desfase = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - desfase).toISOString().slice(0, 10);
}

/** La fecha elegida se guarda como ISO a las 12:00 locales de ese día. */
// Conservado: si el campo de fecha se deja vacío, la fecha no es válida y
// `toISOString()` lanza `RangeError`; el formulario no valida la fecha.
export function happenedAtFromInputDate(date: string): string {
  return new Date(`${date}T12:00:00`).toISOString();
}

/** Formulario recién abierto: compra, sin moneda, sin cifras, con fecha de hoy. */
export function emptyTransactionForm(today: string): TransactionFormValues {
  return { kind: "compra", coinId: "", amount: "", unitPrice: "", date: today };
}

/**
 * Precio que se propone al elegir moneda: el de hoy, que es lo más probable.
 * `null` si la moneda no está en la lista (no se toca lo escrito).
 */
export function suggestedUnitPrice(coins: Coin[], coinId: string): string | null {
  const coin = coins.find((item) => item.id === coinId);
  return coin ? String(coin.price) : null;
}

/**
 * "Total de la operación" en vivo: cantidad × precio cuando los dos son
 * números y la cantidad es mayor que cero; si no, `null` (no se enseña).
 */
// Conservado: aquí el precio no se valida, así que un precio negativo da un
// total negativo mientras se escribe (el error sale al enviar).
export function operationTotal(amountText: string, unitPriceText: string): number | null {
  const amount = parseUserAmount(amountText);
  const unitPrice = parseUserAmount(unitPriceText);
  return Number.isFinite(amount) && Number.isFinite(unitPrice) && amount > 0
    ? amount * unitPrice
    : null;
}

/**
 * Valida el formulario y lo convierte en el movimiento a guardar. El orden de
 * las comprobaciones es el de siempre: moneda, cantidad, precio.
 */
// Conservado: una venta mayor que lo que se tiene NO se rechaza aquí; el
// cálculo de posiciones la recorta a lo que hay (`acumular`).
export function buildNewTransaction(
  values: TransactionFormValues,
  coins: Coin[],
): Result<NewTransaction, TransactionFormError> {
  const selected = coins.find((coin) => coin.id === values.coinId);
  if (!selected) return err("no-coin");

  const amount = positiveAmount(values.amount);
  if (!amount.ok) return err("invalid-amount");

  // Vacío significa "no lo recuerdo", y así se queda: sin inventar.
  const unitPrice = optionalNonNegativeAmount(values.unitPrice);
  if (!unitPrice.ok) return err("invalid-price");

  return ok({
    coinId: selected.id,
    symbol: selected.symbol,
    kind: values.kind,
    amount: amount.value,
    unitPrice: unitPrice.value,
    happenedAt: happenedAtFromInputDate(values.date),
  });
}
