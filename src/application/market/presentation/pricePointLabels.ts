import type { PricePoint } from "../../../domain/market/coin.ts";
import { isHourlyRange } from "../../../domain/shared/range.ts";

/** Un punto del histórico con sus etiquetas de fecha ya escritas. */
export interface LabeledPricePoint extends PricePoint {
  /** Etiqueta corta para el eje X. */
  date: string;
  /** Fecha completa para el tooltip. */
  fullDate: string;
}

/** Etiqueta corta del eje: la hora si la serie es por horas, la fecha si no. */
export function formatPointDate(timestamp: number, days: number): string {
  const moment = new Date(timestamp);
  return isHourlyRange(days)
    ? moment.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    : moment.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

/** Fecha completa para el tooltip. */
export function formatPointFullDate(timestamp: number, days: number): string {
  const moment = new Date(timestamp);
  return isHourlyRange(days)
    ? moment.toLocaleString("es-ES", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : moment.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

export function labelPricePoints(points: PricePoint[], days: number): LabeledPricePoint[] {
  return points.map((point) => ({
    timestamp: point.timestamp,
    date: formatPointDate(point.timestamp, days),
    fullDate: formatPointFullDate(point.timestamp, days),
    price: point.price,
  }));
}
