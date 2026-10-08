import type { PricePoint } from "../market/coin.ts";
import type { RangeDays } from "../shared/range.ts";
import type { Trend } from "./figures.ts";

/** Rango con el que se abre la gráfica del modal (`CryptoDetailsModal.tsx:21`). */
export const DEFAULT_DETAIL_RANGE: RangeDays = 30;

/** Holgura del eje vertical: 2 % por debajo del mínimo y por encima del máximo. */
const AXIS_PADDING = 0.02;

/**
 * Límites del eje de precios. Arrancar en cero aplasta la curva, así que se
 * ajusta al rango real con holgura (`CryptoPriceChart.tsx:76-77`).
 */
export function priceAxisDomain(min: number, max: number): [number, number] {
  return [min * (1 - AXIS_PADDING), max * (1 + AXIS_PADDING)];
}

/** Resumen de la serie de precios ya cargada. */
export interface PriceSeriesSummary {
  min: number;
  max: number;
  first: number;
  last: number;
  /** Diferencia entre el último y el primer precio del periodo. */
  change: number;
  /** Esa diferencia en % del primer precio; `null` si el primero es 0. */
  changePct: number | null;
  /** Conservado el criterio del modal: 0 cuenta como subida. */
  trend: Trend;
  axisDomain: [number, number];
}

/**
 * Resume una serie de precios (precio en el tiempo). Devuelve `null` si no
 * hay ningún punto: es el estado vacío de la gráfica.
 */
export function summarizePriceSeries(points: readonly PricePoint[]): PriceSeriesSummary | null {
  if (points.length === 0) return null;

  let min = points[0].price;
  let max = points[0].price;
  for (const point of points) {
    if (point.price < min) min = point.price;
    if (point.price > max) max = point.price;
  }

  const first = points[0].price;
  const last = points[points.length - 1].price;
  const change = last - first;

  return {
    min,
    max,
    first,
    last,
    change,
    changePct: first === 0 ? null : (change / first) * 100,
    trend: change >= 0 ? "up" : "down",
    axisDomain: priceAxisDomain(min, max),
  };
}

/** Los 4 estados de la gráfica del modal. */
export type PriceSeriesStatus = "error" | "loading" | "empty" | "ready";

export interface PriceSeriesLoad {
  isError: boolean;
  isPending: boolean;
  /** Puntos cargados; `undefined` mientras no hay datos. */
  pointCount: number | undefined;
}

/**
 * Qué estado toca pintar. Se conserva la prioridad de
 * `CryptoPriceChart.tsx:56-65`: primero el error, después la carga.
 * "empty" es nuevo: antes una serie sin puntos pintaba una gráfica en blanco.
 */
export function priceSeriesStatus(load: PriceSeriesLoad): PriceSeriesStatus {
  if (load.isError) return "error";
  if (load.isPending) return "loading";
  if (load.pointCount === undefined || load.pointCount === 0) return "empty";
  return "ready";
}
