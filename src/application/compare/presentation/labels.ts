import type { ComparisonRow } from "../../../domain/compare/series.ts";
import {
  formatPointDate,
  formatPointFullDate,
} from "../../market/presentation/pricePointLabels.ts";
import { formatCurrency } from "../../shared/presentation/format.ts";

/** Una fila de la comparación con sus etiquetas de fecha ya escritas. */
export interface LabeledComparisonRow extends ComparisonRow {
  /** Etiqueta corta para el eje X. */
  date: string;
  /** Fecha completa para el tooltip. */
  fullDate: string;
}

/**
 * Pone las etiquetas de fecha. Salen del instante real del punto de la primera
 * serie (`referenceTimestamp`), igual que antes, no del intervalo redondeado.
 */
export function labelComparisonRows(rows: ComparisonRow[], days: number): LabeledComparisonRow[] {
  return rows.map((row) => ({
    ...row,
    date: formatPointDate(row.referenceTimestamp, days),
    fullDate: formatPointFullDate(row.referenceTimestamp, days),
  }));
}

/** Marca del eje Y de la gráfica: "25 %". */
export function formatChangeAxis(value: number): string {
  return `${value.toFixed(0)} %`;
}

/** "precio inicial → precio final" de un puesto de la clasificación. */
export function formatPriceRange(firstPrice: number, lastPrice: number): string {
  return `${formatCurrency(firstPrice)} → ${formatCurrency(lastPrice)}`;
}
