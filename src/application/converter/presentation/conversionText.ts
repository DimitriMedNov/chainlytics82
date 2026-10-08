import type { Conversion, ConverterFormState } from "../../../domain/converter/conversion.ts";
import type { Convertible } from "../../../domain/converter/convertible.ts";
import { formatAmount, formatCurrency } from "../../shared/presentation/format.ts";

/** Texto del campo "Resultado": hasta 8 decimales; vacío si no hay conversión. */
export function resultText(conversion: Conversion | null): string {
  return conversion === null ? "" : formatAmount(conversion.value);
}

/** Línea resumen "{cantidad} {desde} = {resultado} {hacia}"; `null` sin conversión. */
export function summaryText(form: ConverterFormState, conversion: Conversion | null): string | null {
  if (conversion === null) return null;
  return `${formatAmount(conversion.amount)} ${form.fromCode} = ${resultText(conversion)} ${form.toCode}`;
}

/** Línea bajo cada selector: "1 {código} = {precio en dólares}". */
export function unitPriceText(option: Convertible): string {
  return `1 ${option.code} = ${formatCurrency(option.usdPrice)}`;
}
