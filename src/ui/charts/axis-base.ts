/**
 * Añadido por el proyecto (pieza compartida de gráficas): adaptador de base
 * del eje Y.
 *
 * Bklit calcula solo el eje vertical y, con valores positivos, lo arranca en
 * cero. Para que una serie de precios no quede aplastada arriba se dibuja la
 * altura sobre una base (`plotted = valor - base`) y las marcas del eje
 * vuelven a sumar esa base al escribirse. El valor real viaja intacto.
 *
 * `LineChart` y `AreaChart` admiten ya `yDomain={[mínimo, máximo]}`, que
 * resuelve lo mismo sin tocar los datos; este adaptador sirve donde no hay
 * dominio propio (`BarChart`, `ComposedChart`) o para no cambiar una gráfica
 * que ya lo usa.
 */

/** Campo donde se guarda la altura que dibuja Bklit. */
export const AXIS_BASE_PLOT_KEY = "plotted";

/** Dominio del eje vertical: `[mínimo, máximo]`. */
export type AxisBaseDomain = readonly [number, number];

/** Fila lista para Bklit: la original más la altura sobre la base. */
export type AxisBasedRow<T extends object> = T & {
  plotted: number;
  [key: string]: unknown;
};

/** Valor más bajo del eje; 0 si no hay dominio (o no es un número finito). */
export function axisBaseOf(domain: AxisBaseDomain | null | undefined): number {
  const base = domain?.[0];
  return typeof base === "number" && Number.isFinite(base) ? base : 0;
}

/**
 * Añade `plotted = valor - base` a cada punto.
 * `getValue` lee el valor real de cada punto (por ejemplo, `(p) => p.price`).
 */
export function toAxisBasedRows<T extends object>(
  points: readonly T[],
  getValue: (point: T) => number,
  base: number
): AxisBasedRow<T>[] {
  return points.map((point) => ({
    ...point,
    plotted: getValue(point) - base,
  }));
}

/**
 * Envuelve el formateador de las marcas del eje Y para que escriban el valor
 * real: `formatValue={withAxisBase(formatAxisPrice, base)}`.
 */
export function withAxisBase(
  format: (value: number) => string,
  base: number
): (plotted: number) => string {
  return (plotted) => format(plotted + base);
}
