/** Motivo del fallo, para que la interfaz pueda distinguirlos sin mirar el texto. */
export type AnalystErrorCode =
  | "unauthorized"
  | "no-credits"
  | "forbidden"
  | "rate-limited"
  | "failed"
  | "empty"
  | "network";

/** Fallo con un mensaje ya pensado para enseñárselo a la persona. */
export class AnalystError extends Error {
  readonly status: number | null;
  readonly code: AnalystErrorCode;

  constructor(message: string, status: number | null, code: AnalystErrorCode) {
    super(message);
    this.name = "AnalystError";
    this.status = status;
    this.code = code;
  }
}

/** Cualquier fallo sin mensaje propio: 400, 500, otro estado, o sin red. */
export const ANALYST_GENERIC_ERROR = "No se pudo obtener respuesta de la IA";
/** El modelo cerró el flujo sin mandar texto. */
export const ANALYST_EMPTY_ANSWER = "La IA no devolvió ninguna respuesta. Prueba otra vez.";
/** Se intentó preguntar sin sesión. */
export const ANALYST_SIGN_IN_REQUIRED = "Debes iniciar sesión para usar la IA";

const KNOWN: Record<number, { code: AnalystErrorCode; message: string }> = {
  401: { code: "unauthorized", message: "Sesión expirada. Inicia sesión nuevamente." },
  // Conservado: el texto habla de «tu workspace», resto de la plataforma
  // original (inventario §9, punto 17).
  402: { code: "no-credits", message: "Créditos de IA agotados. Agrega fondos en tu workspace." },
  403: { code: "forbidden", message: "No tienes permisos para usar la IA." },
  429: { code: "rate-limited", message: "Demasiadas solicitudes. Intenta en un momento." },
};

/** Error de un estado HTTP con mensaje propio (401, 402, 403, 429), o `null`. */
export function knownStatusError(status: number): AnalystError | null {
  const known = KNOWN[status];
  return known ? new AnalystError(known.message, status, known.code) : null;
}

/** Error de cualquier otra respuesta rechazada (400, 500...). */
// Conservado: un 400 por pasarse de los límites del servidor se ve con el
// mensaje genérico (inventario §9, punto 14).
export function failedStatusError(status: number): AnalystError {
  return new AnalystError(ANALYST_GENERIC_ERROR, status, "failed");
}

export function emptyAnswerError(): AnalystError {
  return new AnalystError(ANALYST_EMPTY_ANSWER, null, "empty");
}

/** Lo que no sea un `AnalystError` (red caída, fallo inesperado) se enseña con el texto genérico. */
export function toAnalystError(error: unknown): AnalystError {
  if (error instanceof AnalystError) return error;
  return new AnalystError(ANALYST_GENERIC_ERROR, null, "network");
}

// Conservado: un 401 del analista cierra la sesión entera (inventario §9, punto 16).
export function mustSignOut(error: AnalystError): boolean {
  return error.status === 401;
}
