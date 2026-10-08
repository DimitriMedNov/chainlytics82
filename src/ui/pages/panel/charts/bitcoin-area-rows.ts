import type { LabeledPricePoint } from "@/application/market/presentation/pricePointLabels";
import { formatCurrency } from "@/application/shared/presentation/format";
import type { AxisDomain } from "@/domain/panel/bitcoinChart";

/**
 * Adaptador entre la serie del Panel y la gráfica de área de Bklit.
 *
 * Bklit calcula solo el eje vertical y, con valores positivos, lo arranca
 * siempre en cero (no admite un dominio propio). Para conservar el eje del
 * Panel (`yDomain`, que arranca en `mínimo × 0,98`) se dibuja la altura sobre
 * la base del eje (`plotted = price - base`) y las marcas vuelven a sumar esa
 * base al escribirse. El precio real viaja intacto en `price`.
 */
export const BITCOIN_AREA_X_KEY = "timestamp";
export const BITCOIN_AREA_Y_KEY = "plotted";

export interface BitcoinAreaRow extends LabeledPricePoint {
  /** Altura que dibuja Bklit: precio menos la base del eje. */
  plotted: number;
  [key: string]: unknown;
}

/** Valor más bajo del eje vertical; 0 si no hay dominio. */
export function bitcoinAxisBase(yDomain: AxisDomain | null): number {
  return yDomain ? yDomain[0] : 0;
}

export function toBitcoinAreaRows(points: readonly LabeledPricePoint[], base: number): BitcoinAreaRow[] {
  return points.map((point) => ({ ...point, plotted: point.price - base }));
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
  if (!first || !last) return "Evolución del precio de Bitcoin.";
  return (
    `Evolución del precio de Bitcoin: de ${formatCurrency(first.price)} (${first.fullDate}) ` +
    `a ${formatCurrency(last.price)} (${last.fullDate}).`
  );
}
