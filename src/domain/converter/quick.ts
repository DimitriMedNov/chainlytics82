import type { Convertible } from "./convertible.ts";

/** Cuántas criptos enseña "Tasas actuales". */
export const QUICK_RATES_COUNT = 4;

/** "Tasas actuales": las 4 primeras criptos de la lista. */
export function quickRates(options: readonly Convertible[]): Convertible[] {
  return options.filter((option) => option.kind === "cripto").slice(0, QUICK_RATES_COUNT);
}

/** Atajos de "Conversiones rápidas": cuánto de cada moneda se pasa a dólares. */
export const QUICK_CONVERSIONS: ReadonlyArray<{ code: string; amount: number }> = [
  { code: "BTC", amount: 1 },
  { code: "ETH", amount: 1 },
  { code: "SOL", amount: 10 },
  { code: "ADA", amount: 1000 },
];

export interface QuickConversion {
  code: string;
  amount: number;
  name: string;
  /** Valor en dólares de `amount` unidades. */
  value: number;
}

/** Equivalencias calculadas con el precio real, no escritas a mano. */
// Conservado: si una moneda del atajo no está en la lista (p. ej. SOL o ADA
// salen de las 30 mayores), su fila desaparece sin aviso (inventario §2).
export function quickConversions(options: readonly Convertible[]): QuickConversion[] {
  return QUICK_CONVERSIONS.flatMap(({ code, amount }) => {
    const option = options.find((item) => item.code === code);
    return option ? [{ code, amount, name: option.name, value: option.usdPrice * amount }] : [];
  });
}

/** Una barra de la gráfica de cambio en 24 h. */
export interface RateChangeBar {
  code: string;
  name: string;
  /** Cambio en 24 h, en puntos porcentuales (2.45 es +2,45 %). */
  change24h: number;
  direction: "up" | "down";
}

/**
 * Serie para la gráfica de barras: el cambio en 24 h de las tasas mostradas,
 * en el mismo orden. Las que no tienen cambio conocido no llevan barra.
 * `up` con cambio mayor o igual que cero, igual que el color de la lista.
 */
export function rateChangeSeries(rates: readonly Convertible[]): RateChangeBar[] {
  return rates.flatMap((rate) =>
    rate.change24h === null
      ? []
      : [
          {
            code: rate.code,
            name: rate.name,
            change24h: rate.change24h,
            direction: rate.change24h >= 0 ? ("up" as const) : ("down" as const),
          },
        ],
  );
}
