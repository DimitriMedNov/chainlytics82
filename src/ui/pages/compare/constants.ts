/** Id del selector «Añadir moneda» (el mismo que tenía la pantalla anterior). */
export const ADD_COIN_ID = "comparar-anadir";

/** Ids de los títulos de cada bloque, para `aria-labelledby`. */
export const COMPARE_IDS = {
  picker: "comparar-seleccion-titulo",
  chart: "comparar-grafica-titulo",
  ranking: "comparar-ranking-titulo",
} as const;

/** Clases escritas enteras para que Tailwind las genere: `colorIndex` N → `--chart-N`. */
const SERIES_BG: Record<number, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
};

/** Fondo del color de la serie; sin serie (`null`), un gris neutro. */
export function seriesBgClass(colorIndex: number | null): string {
  return (colorIndex !== null && SERIES_BG[colorIndex]) || "bg-muted-foreground";
}

/** Alto del hueco de la gráfica de líneas: el de su esqueleto (`ChartSkeleton height="lg"`). */
export const COMPARISON_CHART_HEIGHT = "h-80";

/** Alto del hueco de las barras del ranking: el de su esqueleto (`ChartSkeleton height="sm"`). */
export const RANKING_BARS_HEIGHT = "h-40";
