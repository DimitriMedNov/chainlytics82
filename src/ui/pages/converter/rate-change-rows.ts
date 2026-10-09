import { formatPercent } from "@/application/shared/presentation/format";
import type { RateChangeBar } from "@/domain/converter/quick";

/**
 * Adaptador entre `RateChangeBar` y la gráfica de barras de Bklit.
 *
 * Bklit pinta un color por serie y su eje arranca en cero (no dibuja negativos):
 * el cambio va en dos series apiladas, `up` y `down`, con el TAMAÑO del cambio;
 * el sentido lo dan el color, la flecha y el signo del texto. `down` solo existe
 * en las que bajan.
 */
export const RATE_CATEGORY_KEY = "code";
export const RATE_UP_KEY = "up";
export const RATE_DOWN_KEY = "down";

export interface RateBarRow {
  code: string;
  name: string;
  /** Cambio con signo, para la etiqueta. */
  change24h: number;
  /** El cambio ya escrito: «+2.45 %». */
  text: string;
  up: number;
  down?: number;
  [key: string]: unknown;
}

export function toRateBarRows(bars: readonly RateChangeBar[]): RateBarRow[] {
  return bars.map((bar) => {
    const size = Math.abs(bar.change24h);
    const row: RateBarRow = {
      code: bar.code,
      name: bar.name,
      change24h: bar.change24h,
      text: formatPercent(bar.change24h),
      up: bar.direction === "up" ? size : 0,
    };
    if (bar.direction === "down") row.down = size;
    return row;
  });
}

/** Texto alternativo de la gráfica: el valor de cada moneda, escrito. */
export function describeRateBars(title: string, rows: readonly RateBarRow[]): string {
  return `${title}: ${rows.map((row) => `${row.name} ${row.text}`).join("; ")}.`;
}

export type RateBarLabel = Pick<RateBarRow, "code" | "name" | "change24h" | "text">;

/** Bklit devuelve cada fila como registro sin tipo: se comprueba antes de leerla. */
export function readRateBar(row: Record<string, unknown>): RateBarLabel | null {
  const { code, name, change24h, text } = row;
  if (typeof code !== "string" || typeof name !== "string" || typeof change24h !== "number" || typeof text !== "string") {
    return null;
  }
  return { code, name, change24h, text };
}
