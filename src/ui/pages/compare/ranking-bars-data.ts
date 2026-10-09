import { formatPercent } from "@/application/shared/presentation/format";
import type { RankingBar } from "@/domain/compare/charts";
import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";

/** Claves de cada barra tal como las lee Bklit. */
export const BAR_KEYS = { label: "label", rises: "sube", falls: "baja", value: "value" } as const;

/**
 * Forma de datos para `BarChart` de Bklit. Su escala va de 0 al máximo y cada serie tiene
 * un solo color, así que la barra mide el tamaño de la variación y va en una de dos
 * series: «sube» o «baja». El valor con su signo viaja aparte, para el tooltip.
 */
export function toBarPoints(bars: RankingBar[]): Record<string, unknown>[] {
  return bars.map((bar) => ({
    [BAR_KEYS.label]: bar.label,
    [BAR_KEYS.value]: bar.value,
    [bar.rises ? BAR_KEYS.rises : BAR_KEYS.falls]: Math.abs(bar.value),
  }));
}

/** «BTC +2,45 %, ETH -1,20 %», en el orden del ranking. */
export function barsSummary(bars: RankingBar[]): string {
  return bars.map((bar) => COMPARE_TEXTS.chart.entry(bar.label, formatPercent(bar.value))).join(", ");
}

/** Separación entre barras (fracción de su hueco) para que ninguna pase de ~20 px de grosor. */
const BAR_GAP_BY_COUNT: Record<number, number> = { 1: 0.75, 2: 0.6, 3: 0.45, 4: 0.3 };

export function barGapFor(count: number): number {
  return BAR_GAP_BY_COUNT[count] ?? 0.25;
}

/** Lo que enseña el tooltip de una barra, o `null` si el punto no es una barra. */
export function barTooltip(point: Record<string, unknown>): { label: string; value: number } | null {
  const label = point[BAR_KEYS.label];
  const value = point[BAR_KEYS.value];
  return typeof label === "string" && typeof value === "number" ? { label, value } : null;
}
