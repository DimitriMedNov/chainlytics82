import type { PricePoint } from "../market/coin.ts";
import type { RangeDays } from "../shared/range.ts";

/** Moneda de la gráfica de precio del Panel (id de CoinGecko). */
export const BITCOIN_ID = "bitcoin";

/** Rango con el que arranca la gráfica de Bitcoin. */
export const DEFAULT_BITCOIN_RANGE: RangeDays = 90;

/** Holgura del eje Y por debajo del mínimo y por encima del máximo. */
export const Y_AXIS_FLOOR = 0.98;
export const Y_AXIS_CEILING = 1.02;

export type AxisDomain = readonly [min: number, max: number];

/**
 * Dominio del eje Y: `mínimo × 0,98 … máximo × 1,02`. Arrancar en cero
 * aplasta la curva, así que se ajusta al rango real con holgura.
 * Devuelve null si la serie no tiene puntos.
 */
export function priceAxisDomain(points: readonly PricePoint[]): AxisDomain | null {
  if (points.length === 0) return null;
  let min = points[0].price;
  let max = points[0].price;
  for (const point of points) {
    if (point.price < min) min = point.price;
    if (point.price > max) max = point.price;
  }
  return [min * Y_AXIS_FLOOR, max * Y_AXIS_CEILING];
}

/** Una serie vacía no se dibuja: se enseña el estado vacío. */
export function isEmptySeries(points: readonly PricePoint[]): boolean {
  return points.length === 0;
}

/** Serie lista para una gráfica de área: los puntos y el dominio de su eje Y. */
export interface PriceAreaSeries<Point extends PricePoint> {
  points: readonly Point[];
  /** null cuando no hay puntos. */
  yDomain: AxisDomain | null;
}

/**
 * Serie de precio para un área, sobre los puntos ya cargados. Conserva los
 * puntos tal cual (con sus etiquetas, si las traen) y les añade el dominio.
 */
export function priceAreaSeries<Point extends PricePoint>(
  points: readonly Point[],
): PriceAreaSeries<Point> {
  return { points, yDomain: priceAxisDomain(points) };
}
