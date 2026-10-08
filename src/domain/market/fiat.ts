/** Una moneda fiat convertible (USD, EUR, MXN...). */
export interface FiatRate {
  code: string;
  name: string;
  /** Cuánto vale 1 unidad de esta moneda en dólares. */
  usdPerUnit: number;
}

/** Monedas fiat que ofrece el convertidor. */
export const FIAT: ReadonlyArray<{ code: string; name: string }> = [
  { code: "USD", name: "Dólar estadounidense" },
  { code: "EUR", name: "Euro" },
  { code: "MXN", name: "Peso mexicano" },
  { code: "GBP", name: "Libra esterlina" },
  { code: "JPY", name: "Yen japonés" },
];
