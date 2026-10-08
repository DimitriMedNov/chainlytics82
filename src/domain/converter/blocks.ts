/** Estado de la lectura de la que depende un bloque de la pantalla. */
export interface BlockSource {
  isPending: boolean;
  isError: boolean;
  /** Cuántas filas tiene el bloque con lo ya cargado. */
  rows: number;
}

export type BlockStatus = "loading" | "error" | "empty" | "ready";

/**
 * Qué toca pintar en un bloque lateral. Manda lo que ya se puede enseñar: con
 * filas se enseñan aunque la última recarga haya fallado; sin filas, el fallo
 * es "error" y la ausencia de datos es "vacío".
 */
export function blockStatus({ isPending, isError, rows }: BlockSource): BlockStatus {
  if (isPending) return "loading";
  if (rows > 0) return "ready";
  return isError ? "error" : "empty";
}

export type FormStatus = "error" | "loading" | "ready";

/** Qué toca pintar en el formulario. El error manda sobre la carga. */
// Conservado: basta con que falle una de las dos lecturas (criptos o fiat)
// para bloquear todo el formulario (inventario §9, punto 29).
export function formStatus(isPending: boolean, isError: boolean): FormStatus {
  if (isError) return "error";
  return isPending ? "loading" : "ready";
}
