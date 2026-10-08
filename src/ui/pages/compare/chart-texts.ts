/**
 * Textos que solo existen por las gráficas (nombres accesibles y leyendas). Son nuevos:
 * la pantalla anterior no los tenía, por eso no están en `COMPARE_TEXTS`.
 */
export const COMPARE_CHART_TEXTS = {
  /** Nombre accesible de la gráfica de líneas; `summary` son los valores finales. */
  linesLabel: (summary: string) =>
    `Gráfica de líneas: variación de cada moneda desde el inicio del periodo. Al final del periodo: ${summary}.`,
  /** Nombre accesible de las barras del ranking. */
  barsLabel: (summary: string) =>
    `Gráfica de barras: cuánto ha variado cada moneda en el periodo, de mejor a peor. ${summary}.`,
  /** «BTC +2,45 %» */
  entry: (symbol: string, percent: string) => `${symbol} ${percent}`,
  rises: "Sube",
  falls: "Baja",
} as const;
