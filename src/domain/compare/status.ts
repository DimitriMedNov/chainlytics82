/** Estado del bloque "Qué comparar" (catálogo de monedas + elegidas). */
export type PickerStatus = "loading" | "error" | "empty" | "ready";

/** Estado del bloque de la gráfica. Hay dos vacíos distintos. */
export type ChartStatus = "empty-selection" | "error" | "loading" | "empty-no-common" | "ready";

/** Estado del bloque de la clasificación. */
export type RankingStatus = "ready" | "empty-selection" | "error" | "loading" | "empty-no-common";

/**
 * Mismo orden de decisión que la pantalla anterior: error, cargando y, con el
 * catálogo ya cargado, vacío si no hay ninguna moneda elegida a la vista.
 * En "empty" el selector para añadir se sigue pintando.
 */
export function pickerStatus(input: {
  isError: boolean;
  isPending: boolean;
  selectedCount: number;
}): PickerStatus {
  if (input.isError) return "error";
  if (input.isPending) return "loading";
  return input.selectedCount === 0 ? "empty" : "ready";
}

/**
 * Mismo orden de decisión que la pantalla anterior: sin selección, error,
 * cargando, sin puntos en común y, si no, la gráfica.
 */
export function chartStatus(input: {
  selectedCount: number;
  isError: boolean;
  isPending: boolean;
  rowCount: number;
}): ChartStatus {
  if (input.selectedCount === 0) return "empty-selection";
  if (input.isError) return "error";
  if (input.isPending) return "loading";
  return input.rowCount === 0 ? "empty-no-common" : "ready";
}

/**
 * Conservado: si hay resultados, la clasificación se pinta ("ready") aunque la
 * gráfica siga cargando o en error (inventario §9 nº 28). Antes, sin
 * resultados, la tarjeta simplemente no existía; el resto de estados dicen por
 * qué no hay, para que la interfaz nueva pueda pintarlos.
 */
export function rankingStatus(input: {
  resultCount: number;
  selectedCount: number;
  isError: boolean;
  isPending: boolean;
}): RankingStatus {
  if (input.resultCount > 0) return "ready";
  if (input.selectedCount === 0) return "empty-selection";
  if (input.isError) return "error";
  if (input.isPending) return "loading";
  return "empty-no-common";
}
