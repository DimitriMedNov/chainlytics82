import { formatCurrency } from "@/application/shared/presentation/format";
import { gainOf, type Gain } from "@/domain/portfolio-screen/gain";
import type { PositionGainPoint } from "@/domain/portfolio-screen/series";

/** Series de la gráfica: una para lo que sube y otra para lo que baja. */
export const RISES_KEY = "sube";
export const FALLS_KEY = "baja";
/** Clave de la categoría (una fila por posición). */
export const CATEGORY_KEY = "symbol";

/** Lo que se escribe en la fila de una posición sin coste (mismo texto que su etiqueta). */
export const NO_COST_LABEL = "Sin coste";

/** Alto de cada fila, en rem: la gráfica crece con el número de posiciones. */
const ROW_HEIGHT_REM = 2;

/** Una fila de la gráfica, con la regla de signo del dominio ya aplicada. */
export interface GainBar {
  coinId: string;
  symbol: string;
  name: string;
  /** Ganancia sobre el papel; `known: false` si la posición no tiene coste. */
  gain: Gain;
  /** Importe con su signo ("+$1.234,00", "−$50,00") o «Sin coste». */
  text: string;
}

/** Fila tal como la entiende `BarChart` de Bklit (claves sueltas). */
export type GainBarRow = Record<string, unknown>;

function gainText(gain: Gain): string {
  return gain.known ? `${gain.sign}${formatCurrency(gain.absValue)}` : NO_COST_LABEL;
}

/** `screen.gains` → filas de la gráfica, una por posición y en el mismo orden. */
export function toGainBars(points: PositionGainPoint[]): GainBar[] {
  return points.map((point) => {
    const gain = gainOf(point.unrealizedPnl, null);
    return { coinId: point.coinId, symbol: point.symbol, name: point.name, gain, text: gainText(gain) };
  });
}

/** `false` si ninguna posición tiene coste: no hay ninguna barra que pintar. */
export function hasKnownGain(bars: GainBar[]): boolean {
  return bars.some((bar) => bar.gain.known);
}

/**
 * Datos para Bklit. Su eje empieza siempre en 0 y no admite negativos, así que
 * la barra mide el tamaño de la ganancia y la serie (y el signo del texto) dice
 * si sube o baja. Una posición sin coste no lleva ninguna de las dos claves:
 * no se pinta barra, no se inventa un cero.
 */
export function toBarRows(bars: GainBar[]): GainBarRow[] {
  return bars.map((bar) => {
    if (!bar.gain.known) return { [CATEGORY_KEY]: bar.symbol };
    return {
      [CATEGORY_KEY]: bar.symbol,
      [bar.gain.rises ? RISES_KEY : FALLS_KEY]: bar.gain.absValue,
    };
  });
}

/** Alto de la gráfica para `rows` filas. */
export function chartHeight(rows: number): string {
  return `${rows * ROW_HEIGHT_REM}rem`;
}
