import { COIN_DETAIL_TEXTS as T } from "@/application/coin-detail/presentation/texts";
import type { LabeledPricePoint } from "@/application/market/presentation/pricePointLabels";
import { formatCurrency, formatPercent } from "@/application/shared/presentation/format";
import type { PriceSeriesSummary } from "@/domain/coin-detail/priceSeries";

/**
 * Adaptador entre la serie del proyecto y la gráfica de línea de Bklit.
 *
 * Se dibuja el precio real. El eje vertical no arranca en cero: `PriceChart`
 * le pasa a Bklit el eje del modal (`summary.axisDomain`) con `yDomain`.
 */
export const PRICE_CHART_X_KEY = "timestamp";
export const PRICE_CHART_Y_KEY = "price";

/** Bklit pide filas como registro abierto; los campos son los del punto. */
export interface PriceChartRow extends LabeledPricePoint {
  [key: string]: unknown;
}

export function toPriceChartRows(points: readonly LabeledPricePoint[]): PriceChartRow[] {
  return points.map((point) => ({ ...point }));
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
  if (!summary) return T.chartAlt(coinName);
  return T.chartAltSummary({
    coinName,
    first: formatCurrency(summary.first),
    last: formatCurrency(summary.last),
    changePct: summary.changePct === null ? null : formatPercent(summary.changePct),
    min: formatCurrency(summary.min),
    max: formatCurrency(summary.max),
  });
}
