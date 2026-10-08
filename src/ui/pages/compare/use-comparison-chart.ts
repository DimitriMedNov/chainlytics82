import { useMemo } from "react";
import type { LabeledComparisonRow } from "@/application/compare/presentation/labels";
import { formatPercent } from "@/application/shared/presentation/format";
import { tooltipEntries, type LineSeries } from "@/domain/compare/charts";
import type { Coin } from "@/domain/market/coin";
import { COMPARE_CHART_TEXTS } from "@/ui/pages/compare/chart-texts";

/** Clave del instante en cada punto. Lleva `$` para no chocar con el id de una moneda. */
export const COMPARISON_X_KEY = "$timestamp";

/** Un punto tal como lo pide Bklit: plano, con el instante y un número por moneda. */
export type ComparisonPoint = Record<string, unknown>;

export interface ComparisonChartModel {
  /** Filas aplanadas: `{ $timestamp, [coinId]: % }`. */
  data: ComparisonPoint[];
  /** Series que se dibujan: las que tienen algún punto. */
  lines: LineSeries[];
  /** La fila original de un punto de Bklit (para sus etiquetas de fecha), o `null`. */
  rowOf: (point: ComparisonPoint) => LabeledComparisonRow | null;
  /** Valores del último instante, de mejor a peor, como texto. */
  summary: string;
}

/**
 * Adapta lo que devuelve `useCompareScreen().chart` a la forma de datos de Bklit.
 * No calcula nada del negocio: solo cambia la forma y busca filas por su instante.
 */
export function useComparisonChart(
  rows: LabeledComparisonRow[],
  series: LineSeries[],
  coins: Coin[],
): ComparisonChartModel {
  return useMemo(() => {
    const byTimestamp = new Map(rows.map((row) => [row.timestamp, row]));
    const last = rows.at(-1);

    return {
      data: rows.map((row) => ({ ...row.changes, [COMPARISON_X_KEY]: row.timestamp })),
      // Bklit dibuja en el borde superior una serie sin valores: no se monta su línea.
      lines: series.filter((line) => line.points.length > 0),
      rowOf: (point) => {
        const timestamp = point[COMPARISON_X_KEY];
        return typeof timestamp === "number" ? (byTimestamp.get(timestamp) ?? null) : null;
      },
      summary: last
        ? tooltipEntries(last, coins)
            .map((entry) => COMPARE_CHART_TEXTS.entry(entry.symbol, formatPercent(entry.changePct)))
            .join(", ")
        : "",
    };
  }, [rows, series, coins]);
}
