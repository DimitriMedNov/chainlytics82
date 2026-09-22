const LOCALE = "es-ES";

/**
 * Precio en dólares. Las monedas por debajo de $1 llevan más decimales.
 * Usamos el símbolo delante a mano: el formato "US$" de Intl lo pone detrás
 * y chocaría con el resto de cifras de la app.
 */
export function formatCurrency(value: number): string {
  const small = Math.abs(value) < 1;
  const number = new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: small ? 4 : 2,
    maximumFractionDigits: small ? 6 : 2,
  }).format(Math.abs(value));
  return `${value < 0 ? "−" : ""}$${number}`;
}

/**
 * Cifras grandes con la escala escrita, sin abreviaturas ambiguas:
 * en español "billón" son 10^12 y "MM" se confunde con millones.
 */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const decimal = (divisor: number) =>
    new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 }).format(value / divisor);

  if (abs >= 1e12) return `$${decimal(1e12)} billones`;
  if (abs >= 1e9) return `$${decimal(1e9)} mil millones`;
  if (abs >= 1e6) return `$${decimal(1e6)} millones`;
  return formatCurrency(value);
}

/** Versión corta para las marcas de un eje, donde no cabe el texto largo. */
export function formatAxisPrice(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)} G`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)} M`;
  if (abs >= 1e3) return `$${Math.round(value / 1e3)} K`;
  if (abs >= 1) return `$${value.toFixed(0)}`;
  return `$${value.toFixed(4)}`;
}

/** Porcentaje con signo explícito: +2,45 % / −1,20 % */
export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)} %`;
}

/** Cantidad de moneda (no dólares): 0,5 BTC, 1.000 ADA... */
export function formatAmount(value: number): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 8 }).format(value);
}

/** Número entero grande, para ofertas circulantes. */
export function formatSupply(value: number | null): string {
  if (value === null || value === 0) return "No disponible";
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(value);
}

/** Porcentaje sin signo, para repartos: "100,0 %". */
export function formatPercentShare(value: number): string {
  return `${new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)} %`;
}
