import type { AnalystTurn } from "../../domain/analyst/message.ts";

export interface AnalystStreamRequest {
  /** Credencial de la sesión (`session.accessToken`). */
  accessToken: string;
  /** La conversación entera, en orden. */
  messages: readonly AnalystTurn[];
  /** Para cancelar: al abortar, `stream` rechaza. */
  signal: AbortSignal;
  /** Se llama con el texto acumulado cada vez que llega un trozo. */
  onText: (acumulado: string) => void;
}

/**
 * Flujo del analista: envía la conversación y va entregando la respuesta a
 * trozos. Resuelve al terminar. Rechaza con `AnalystError` si el servidor la
 * rechaza o si no llega texto, y con el error que sea si se cancela o no hay red.
 */
export interface AnalystStreamPort {
  stream(request: AnalystStreamRequest): Promise<void>;
}
