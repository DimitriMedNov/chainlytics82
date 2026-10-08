/** Mensaje del chat con el analista. `id` sirve de `key` estable en la lista. */
export interface AnalystMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/** Lo que viaja al servidor de cada mensaje: rol y contenido, sin `id`. */
export type AnalystTurn = Pick<AnalystMessage, "role" | "content">;

/** Preguntas de ejemplo de la bienvenida. Al pulsarlas se envían tal cual. */
export const ANALYST_SUGGESTIONS: readonly string[] = [
  "¿Cómo está el mercado hoy?",
  "Analiza Bitcoin vs Ethereum",
  "¿Qué son los meme coins?",
  "Explícame el market cap",
];

/** Una pregunta en blanco no se envía. El texto se manda sin recortar. */
export function isBlankQuestion(text: string): boolean {
  return !text.trim();
}

/** La conversación tal como se envía: todo el historial, en orden. */
// Conservado: no se aplican aquí los límites del servidor (50 mensajes, 4000
// caracteres por mensaje) ni se recorta la conversación; al superarlos llega
// un 400 (inventario §9, punto 14).
export function toTurns(messages: readonly AnalystMessage[]): AnalystTurn[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

/**
 * Pone el texto acumulado de la respuesta: actualiza la burbuja del asistente
 * si ya es la última, o la crea al llegar el primer trozo.
 */
export function withAnswerText(
  messages: readonly AnalystMessage[],
  assistantId: string,
  acumulado: string,
): AnalystMessage[] {
  const last = messages[messages.length - 1];
  if (last?.id === assistantId) {
    return [...messages.slice(0, -1), { ...last, content: acumulado }];
  }
  return [...messages, { id: assistantId, role: "assistant", content: acumulado }];
}

/** Quita la respuesta a medias para no dejar un mensaje cortado. */
export function withoutMessage(messages: readonly AnalystMessage[], id: string): AnalystMessage[] {
  return messages.filter((m) => m.id !== id);
}
