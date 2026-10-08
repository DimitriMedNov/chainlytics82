import {
  withAnswerText,
  withoutMessage,
  type AnalystMessage,
} from "./message.ts";

/**
 * Máquina de estados del chat con el analista. Antes estaba repartida entre
 * `loading`, un `ref` y "el último mensaje es del usuario".
 *
 * - `idle`: no hay nada en marcha; se puede preguntar.
 * - `waiting`: pregunta enviada, aún no ha llegado el primer trozo (es cuando
 *   se enseña «Analizando...»).
 * - `streaming`: la respuesta se está escribiendo trozo a trozo.
 * - `error`: la última pregunta falló; `error` lleva el texto del aviso. Se
 *   puede reintentar o preguntar otra cosa.
 *
 * Transiciones permitidas:
 *   idle | error  --asked-->    waiting
 *   error         --retried-->  waiting
 *   waiting | streaming --chunk-->    streaming
 *   waiting | streaming --finished--> idle
 *   waiting | streaming --failed-->   error
 *   waiting | streaming --stopped-->  idle
 * Cualquier otro evento se ignora (devuelve el mismo estado).
 */
export type ChatStatus = "idle" | "waiting" | "streaming" | "error";

export interface ChatState {
  status: ChatStatus;
  messages: AnalystMessage[];
  /** Texto del aviso de error; `null` salvo en `error`. */
  error: string | null;
  /** Id de la respuesta en curso; `null` si no hay ninguna. */
  answerId: string | null;
}

export type ChatEvent =
  | { type: "asked"; question: AnalystMessage; answerId: string }
  | { type: "retried"; answerId: string }
  | { type: "chunk"; answerId: string; acumulado: string }
  | { type: "finished"; answerId: string }
  | { type: "failed"; answerId: string; message: string }
  | { type: "stopped" };

export const INITIAL_CHAT: ChatState = { status: "idle", messages: [], error: null, answerId: null };

/** Hay una respuesta en marcha: no se admite otra pregunta. */
export function isBusy(status: ChatStatus): boolean {
  return status === "waiting" || status === "streaming";
}

/** Se enseña el marcador «Analizando...» (pregunta enviada, sin primer trozo). */
export function isWaitingFirstChunk(state: ChatState): boolean {
  return state.status === "waiting";
}

/** Tras un error la pregunta sigue al final de la lista: se puede reenviar. */
export function canRetry(state: ChatState): boolean {
  return state.status === "error" && state.messages[state.messages.length - 1]?.role === "user";
}

export function chatReducer(state: ChatState, event: ChatEvent): ChatState {
  const busy = isBusy(state.status);
  const current = busy && "answerId" in event && event.answerId === state.answerId;

  switch (event.type) {
    case "asked":
      if (busy) return state;
      return {
        status: "waiting",
        messages: [...state.messages, event.question],
        error: null,
        answerId: event.answerId,
      };
    case "retried":
      if (!canRetry(state)) return state;
      return { ...state, status: "waiting", error: null, answerId: event.answerId };
    case "chunk":
      if (!current) return state;
      return {
        ...state,
        status: "streaming",
        messages: withAnswerText(state.messages, event.answerId, event.acumulado),
      };
    case "finished":
      if (!current) return state;
      return { ...state, status: "idle", answerId: null };
    case "failed":
      if (!current) return state;
      // Conservado: la pregunta del usuario se queda en la lista; solo se quita
      // la respuesta a medias (inventario §9, punto 15).
      return {
        status: "error",
        messages: withoutMessage(state.messages, event.answerId),
        error: event.message,
        answerId: null,
      };
    case "stopped":
      if (!busy) return state;
      return { ...state, status: "idle", answerId: null };
  }
}
