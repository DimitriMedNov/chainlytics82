import { formatAxisPrice, formatCompact, formatPercent } from "@/application/shared/presentation/format";
import type { TopCoinBar, TopCoinChangeBar } from "@/domain/panel/topCoins";

/**
 * Adaptador entre las barras del top 5 y la gráfica de barras de Bklit.
 *
 * Bklit pinta un solo color por serie y su eje arranca siempre en cero (no
 * dibuja valores negativos). Por eso el cambio en 24 h va en dos series
 * apiladas, `up` y `down`, con el TAMAÑO del cambio; el signo lo dan el color,
 * la flecha y el texto («-1.20 %»). `up` vale 0 en las que bajan y `down` solo
 * existe en las que bajan: así la barra de Bklit nunca sale con ancho negativo.
 */
export const TOP_BAR_CATEGORY_KEY = "id";
export const CHANGE_UP_KEY = "up";
export const CHANGE_DOWN_KEY = "down";
export const VOLUME_KEY = "volume";

export interface TopBarRow {
  id: string;
  symbol: string;
  name: string;
  /** Valor ya escrito, corto, para el extremo de la barra. */
  text: string;
  /** Valor ya escrito, completo, para el tooltip y el texto alternativo. */
  fullText: string;
  [key: string]: unknown;
}

export interface ChangeBarRow extends TopBarRow {
  rising: boolean;
  up: number;
  down?: number;
}

export interface VolumeBarRow extends TopBarRow {
  volume: number;
}

export function toChangeBarRows(bars: readonly TopCoinChangeBar[]): ChangeBarRow[] {
  return bars.map((bar) => {
    const size = Math.abs(bar.value);
    const text = formatPercent(bar.value);
    const row: ChangeBarRow = {
      id: bar.id,
      symbol: bar.symbol,
      name: bar.name,
      text,
      fullText: text,
      rising: bar.rising,
      up: bar.rising ? size : 0,
    };
    if (!bar.rising) row.down = size;
    return row;
  });
}

export function toVolumeBarRows(bars: readonly TopCoinBar[]): VolumeBarRow[] {
  return bars.map((bar) => ({
    id: bar.id,
    symbol: bar.symbol,
    name: bar.name,
    text: formatAxisPrice(bar.value),
    fullText: formatCompact(bar.value),
    volume: bar.value,
  }));
}

/** Texto alternativo: qué mide la gráfica y el valor de cada moneda, escritos. */
export function describeBars(title: string, rows: readonly TopBarRow[]): string {
  return `${title}: ${rows.map((row) => `${row.name} ${row.fullText}`).join("; ")}.`;
}

export interface BarLabelData {
  id: string;
  symbol: string;
  name: string;
  text: string;
  fullText: string;
  /** Solo en las barras de cambio. */
  rising: boolean | null;
}

/** Bklit devuelve cada fila como registro sin tipo: se comprueba antes de leerla. */
export function readBarLabel(row: Record<string, unknown>): BarLabelData | null {
  const { id, symbol, name, text, fullText, rising } = row;
  if (
    typeof id !== "string" ||
    typeof symbol !== "string" ||
    typeof name !== "string" ||
    typeof text !== "string" ||
    typeof fullText !== "string"
  ) {
    return null;
  }
  return { id, symbol, name, text, fullText, rising: typeof rising === "boolean" ? rising : null };
}
