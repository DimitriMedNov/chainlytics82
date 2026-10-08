import { toTurns, type AnalystMessage } from "../../domain/analyst/message.ts";
import { err, ok, type Result } from "../../domain/shared/result.ts";
import { toAnalystError, type AnalystError } from "./errors.ts";
import type { AnalystStreamPort } from "./ports.ts";

export interface AskAnalystRequest {
  accessToken: string;
  /** Todo el historial, con la pregunta nueva al final. */
  conversation: readonly AnalystMessage[];
  signal: AbortSignal;
  /** Texto acumulado de la respuesta, cada vez que llega un trozo. */
  onText: (acumulado: string) => void;
}

/** `done`: la respuesta llegó entera. `aborted`: se canceló; no hay nada que enseñar. */
export type AskAnalystOutcome = "done" | "aborted";

/**
 * Preguntar al analista: envía toda la conversación y va entregando la
 * respuesta. El error ya trae el mensaje para la persona.
 */
export async function askAnalyst(
  port: AnalystStreamPort,
  { accessToken, conversation, signal, onText }: AskAnalystRequest,
): Promise<Result<AskAnalystOutcome, AnalystError>> {
  try {
    await port.stream({ accessToken, messages: toTurns(conversation), signal, onText });
    return ok(signal.aborted ? "aborted" : "done");
  } catch (error) {
    // Una cancelación no es un fallo: no se avisa ni se toca la conversación.
    if (signal.aborted) return ok("aborted");
    return err(toAnalystError(error));
  }
}
