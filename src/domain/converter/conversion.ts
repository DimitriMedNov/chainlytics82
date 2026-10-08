import { positiveAmount } from "../shared/userAmount.ts";
import type { Convertible } from "./convertible.ts";

/** Lo que el usuario tiene escrito y elegido en el formulario. */
export interface ConverterFormState {
  /** Texto del campo "Cantidad", tal cual lo escribió. */
  amount: string;
  fromCode: string;
  toCode: string;
}

/** Con qué arranca el formulario: 1 BTC a USD. */
export const DEFAULT_CONVERTER_FORM: ConverterFormState = {
  amount: "1",
  fromCode: "BTC",
  toCode: "USD",
};

/** Una conversión válida. */
export interface Conversion {
  /** La cantidad escrita, ya como número (mayor que cero). */
  amount: number;
  /** Cuántas unidades de destino salen. */
  value: number;
}

/** Por qué no hay resultado que enseñar. */
export type NoConversionReason = "invalid-amount" | "unknown-currency";

/**
 * Convierte pasando por el dólar: `cantidad × usdOrigen / usdDestino`.
 * Devuelve `null` si falta alguna de las dos monedas o si la cantidad está
 * vacía, no es un número, o es cero o negativa.
 */
// Conservado: nada impide que origen y destino sean la misma moneda; en ese
// caso el resultado es la misma cantidad (inventario §9, punto 29).
export function convert(
  amountText: string,
  from: Convertible | undefined,
  to: Convertible | undefined,
): Conversion | null {
  const amount = positiveAmount(amountText);
  if (from === undefined || to === undefined || !amount.ok) return null;
  return { amount: amount.value, value: (amount.value * from.usdPrice) / to.usdPrice };
}

/** Motivo del resultado vacío; `null` si la conversión es válida. */
export function noConversionReason(
  amountText: string,
  from: Convertible | undefined,
  to: Convertible | undefined,
): NoConversionReason | null {
  if (from === undefined || to === undefined) return "unknown-currency";
  return positiveAmount(amountText).ok ? null : "invalid-amount";
}

/**
 * Intercambio: cruza origen y destino y, si había resultado, lo pone como
 * nueva cantidad. Sin resultado, la cantidad se queda como estaba.
 */
// Conservado: la cantidad nueva es el número crudo, con todos sus decimales
// (`String(valor)`), no el texto redondeado a 8 que se ve en "Resultado"
// (inventario §9, punto 29).
export function swapForm(
  form: ConverterFormState,
  conversion: Conversion | null,
): ConverterFormState {
  return {
    amount: conversion !== null ? String(conversion.value) : form.amount,
    fromCode: form.toCode,
    toCode: form.fromCode,
  };
}
