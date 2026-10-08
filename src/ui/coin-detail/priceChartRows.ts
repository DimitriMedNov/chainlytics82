import type { LabeledPricePoint } from "@/application/market/presentation/pricePointLabels";
import { formatCurrency, formatPercent } from "@/application/shared/presentation/format";
import type { PriceSeriesSummary } from "@/domain/coin-detail/priceSeries";

/**
 * Adaptador entre la serie del proyecto y la gráfica de línea de Bklit.
 *
 * Bklit calcula solo el eje vertical y, con valores positivos, lo arranca
 * siempre en cero (no admite un dominio propio). Para conservar el eje del
 * modal (`summary.axisDomain`, que no arranca en cero) se dibuja la altura
 * sobre la base del eje (`plotted = price - base`) y las marcas vuelven a
 * sumar esa base al escribirse. El precio real viaja intacto en `price`.
 */
export const PRICE_CHART_X_KEY = "timestamp";
export const PRICE_CHART_Y_KEY = "plotted";

export interface PriceChartRow extends LabeledPricePoint {
  /** Altura que dibuja Bklit: precio menos la base del eje. */
  plotted: number;
  [key: string]: unknown;
}

/** Valor más bajo del eje vertical; 0 si no hay resumen. */
export function priceAxisBase(summary: PriceSeriesSummary | null): number {
  return summary ? summary.axisDomain[0] : 0;
}

export function toPriceChartRows(points: readonly LabeledPricePoint[], base: number): PriceChartRow[] {
  return points.map((point) => ({ ...point, plotted: point.price - base }));
}

export interface PriceTooltipData {
  fullDate: string;
  price: number;
}

/** Bklit devuelve el punto como registro sin tipo: se comprueba antes de leerlo. */
export function readPriceTooltip(point: Record<string, unknown>): PriceTooltipData | null {
  const { fullDate, price } = point;
  if (typeof fullDate !== "string" || typeof price !== "number") return null;
  return { fullDate, price };
}

/** Texto alternativo de la gráfica: las cifras clave del periodo, escritas. */
export function describePriceSeries(coinName: string, summary: PriceSeriesSummary | null): string {
  if (!summary) return `Evolución del precio de ${coinName}.`;
  const change = summary.changePct === null ? "" : ` (${formatPercent(summary.changePct)})`;
  return (
    `Evolución del precio de ${coinName}: de ${formatCurrency(summary.first)} a ` +
    `${formatCurrency(summary.last)}${change}. Mínimo ${formatCurrency(summary.min)}, ` +
    `máximo ${formatCurrency(summary.max)}.`
  );
}
