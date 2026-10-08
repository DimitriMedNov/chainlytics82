/**
 * Paleta de la distribución, por índice de `screen.distribution` y repitiéndose
 * al acabarse. El mismo índice da el mismo color en la tarta y en la barra de
 * peso: quien pinte la tarta debe usar `seriesColorVar(index)`.
 */
const SERIES = [
  { className: "bg-chart-1", cssVar: "var(--bklit-chart-1)" },
  { className: "bg-chart-2", cssVar: "var(--bklit-chart-2)" },
  { className: "bg-chart-3", cssVar: "var(--bklit-chart-3)" },
  { className: "bg-chart-4", cssVar: "var(--bklit-chart-4)" },
  { className: "bg-chart-5", cssVar: "var(--bklit-chart-5)" },
] as const;

/** Clase de relleno de la serie `index` (marcadores y barras de peso). */
export function seriesColorClass(index: number): string {
  return SERIES[index % SERIES.length].className;
}

/** Color de la serie `index` como variable CSS, para las gráficas de Bklit. */
export function seriesColorVar(index: number): string {
  return SERIES[index % SERIES.length].cssVar;
}
