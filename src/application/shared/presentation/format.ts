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

/** Formateador de marcas de un eje ya ajustado a su rango. */
export type AxisPriceFormatter = (value: number) => string;

/** Marcas que pide un eje vertical si no se dice otra cosa (las gráficas usan `numTicks={4}`). */
export const AXIS_DEFAULT_TICK_COUNT = 4;
const AXIS_MAX_DECIMALS = 8;

/**
 * Paso entre dos marcas contiguas de un eje que va de `domain[0]` a
 * `domain[1]` con unas `tickCount` marcas. Es la misma cuenta que hace d3
 * (`scale.ticks(n)`, la que usa el eje de las gráficas): pasos de 1, 2 o 5
 * por una potencia de diez. Devuelve 0 si el rango no tiene anchura.
 */
export function axisTickStep(
  domain: readonly [number, number],
  tickCount: number = AXIS_DEFAULT_TICK_COUNT,
): number {
  const span = Math.abs(domain[1] - domain[0]);
  if (!Number.isFinite(span) || span <= 0 || !Number.isFinite(tickCount) || tickCount < 1) return 0;
  const raw = span / tickCount;
  const power = Math.floor(Math.log10(raw));
  const error = raw / 10 ** power;
  const factor = error >= Math.sqrt(50) ? 10 : error >= Math.sqrt(10) ? 5 : error >= Math.sqrt(2) ? 2 : 1;
  return factor * 10 ** power;
}

/** Decimales para que dos valores separados por `step` no se escriban igual en la unidad `unit`. */
function axisDecimals(step: number, unit: number, minimum: number): number {
  const needed = Math.ceil(-Math.log10(step / unit) - 1e-9);
  return Math.min(AXIS_MAX_DECIMALS, Math.max(minimum, needed));
}

/**
 * Marca de eje que tiene en cuenta el paso entre marcas: usa los decimales
 * justos para que dos marcas contiguas distintas nunca den el mismo texto
 * (3.000–3.400 con paso 100 → «$3,0 K», «$3,1 K»…). Coma decimal, como el
 * resto de cifras. Con un rango amplio da lo mismo que `formatAxisPrice` en
 * miles y en unidades. Si `step` no es un número positivo, cae en
 * `formatAxisPrice(value)`.
 */
export function formatAxisPriceForStep(value: number, step: number): string {
  if (!Number.isFinite(step) || step <= 0) return formatAxisPrice(value);
  const abs = Math.abs(value);
  const write = (unit: number, minimum: number, suffix: string) =>
    `$${(value / unit).toFixed(axisDecimals(step, unit, minimum)).replace(".", ",")}${suffix}`;

  if (abs >= 1e9) return write(1e9, 1, " G");
  if (abs >= 1e6) return write(1e6, 1, " M");
  if (abs >= 1e3) return write(1e3, 0, " K");
  // Por debajo de la unidad de dólar, como mínimo céntimos.
  return write(1, step < 1 ? 2 : 0, "");
}

/**
 * Fábrica del formateador de un eje a partir de su rango `[mín, máx]` y de las
 * marcas que se le piden al eje (el mismo número que su `numTicks`).
 *
 *   const formatTick = createAxisPriceFormatter(summary.axisDomain, 4);
 *   formatTick(3100) // «$3,1 K»
 */
export function createAxisPriceFormatter(
  domain: readonly [number, number],
  tickCount: number = AXIS_DEFAULT_TICK_COUNT,
): AxisPriceFormatter {
  const step = axisTickStep(domain, tickCount);
  return (value) => formatAxisPriceForStep(value, step);
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
