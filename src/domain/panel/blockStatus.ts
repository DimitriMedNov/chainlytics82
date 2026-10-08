/** Estado de un bloque del Panel que trae datos. */
export type BlockStatus = "loading" | "error" | "empty" | "success";

/** Lo que se sabe de una consulta para decidir el estado del bloque. */
export interface BlockQuery {
  isPending: boolean;
  isError: boolean;
}

/**
 * Mismo orden de decisión que tenía la pantalla: primero el error, después la
 * carga, después el vacío, y si no, los datos.
 */
export function resolveBlockStatus(query: BlockQuery, isEmpty: boolean): BlockStatus {
  if (query.isError) return "error";
  if (query.isPending) return "loading";
  return isEmpty ? "empty" : "success";
}
