import type { LabeledPricePoint } from "@/application/market/presentation/pricePointLabels";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import { formatCurrency } from "@/application/shared/presentation/format";
import type { AxisDomain } from "@/domain/panel/bitcoinChart";

/**
 * Adaptador entre la serie del Panel y la gráfica de área de Bklit.
 *
 * El precio se dibuja tal cual: el eje del Panel (`yDomain`, que arranca en
 * `mínimo × 0,98`) se le pasa a la gráfica con su prop `yDomain`.
 */
export const BITCOIN_AREA_X_KEY = "timestamp";
export const BITCOIN_AREA_Y_KEY = "price";

/** Fila que acepta Bklit: el punto de la serie, legible como registro. */
export interface BitcoinAreaRow extends LabeledPricePoint {
  [key: string]: unknown;
}

export function toBitcoinAreaRows(points: readonly LabeledPricePoint[]): BitcoinAreaRow[] {
  return points.map((point) => ({ ...point }));
}

/** El dominio del hook (solo lectura) como el par que pide la gráfica; sin dominio, lo calcula ella. */
export function toChartDomain(yDomain: AxisDomain | null): [number, number] | undefined {
  return yDomain ? [yDomain[0], yDomain[1]] : undefined;
}

export interface BitcoinTooltipData {
  fullDate: string;
  price: number;
}

/** Bklit devuelve el punto como registro sin tipo: se comprueba antes de leerlo. */
export function readBitcoinTooltip(point: Record<string, unknown>): BitcoinTooltipData | null {
  const { fullDate, price } = point;
  if (typeof fullDate !== "string" || typeof price !== "number") return null;
  return { fullDate, price };
}

/** Texto alternativo de la gráfica: el periodo y sus dos precios extremos en el tiempo, escritos. */
export function describeBitcoinSeries(points: readonly LabeledPricePoint[]): string {
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return PANEL_TEXTS.bitcoin.chartAlt;
  return PANEL_TEXTS.bitcoin.chartAltRange({
    firstPrice: formatCurrency(first.price),
    firstDate: first.fullDate,
    lastPrice: formatCurrency(last.price),
    lastDate: last.fullDate,
  });
}
