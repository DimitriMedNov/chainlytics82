/** Saca el trozo de texto de una línea `data: {...}` del streaming de OpenAI. */
export function deltaDe(json: string): string | null {
  const parsed: unknown = JSON.parse(json);
  if (typeof parsed !== "object" || parsed === null || !("choices" in parsed)) return null;
  const { choices } = parsed;
  if (!Array.isArray(choices)) return null;
  const first: unknown = choices[0];
  if (typeof first !== "object" || first === null || !("delta" in first)) return null;
  const { delta } = first;
  if (typeof delta !== "object" || delta === null || !("content" in delta)) return null;
  return typeof delta.content === "string" ? delta.content : null;
}

export interface SseTextParser {
  /**
   * Recibe el siguiente trozo de texto del flujo (puede cortar una línea por
   * cualquier sitio). Devuelve `true` si ha llegado el cierre `[DONE]`.
   */
  feed(text: string): boolean;
  /** Texto de la respuesta acumulado hasta ahora. */
  text(): string;
}

/**
 * Parser del flujo SSE en formato OpenAI: líneas `data: {json}` con
 * `choices[0].delta.content`, y `data: [DONE]` al final. Llama a `onText` con
 * el texto acumulado cada vez que llega un trozo.
 */
export function createSseTextParser(onText: (acumulado: string) => void): SseTextParser {
  let buffer = "";
  let acc = "";

  return {
    text: () => acc,
    feed(text) {
      buffer += text;

      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") return true;
        try {
          const delta = deltaDe(json);
          if (delta) {
            acc += delta;
            onText(acc);
          }
        } catch {
          // JSON cortado a mitad: se devuelve al buffer y se completa con el siguiente trozo.
          buffer = line + "\n" + buffer;
          break;
        }
      }
      return false;
    },
  };
}

/**
 * Lee el cuerpo de la respuesta hasta `[DONE]` o hasta que se cierre, y
 * devuelve el texto completo (`""` si el modelo no mandó nada).
 */
export async function readSseText(
  body: ReadableStream<Uint8Array>,
  onText: (acumulado: string) => void,
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const parser = createSseTextParser(onText);

  for (;;) {
    const { value, done } = await reader.read();
    if (done) return parser.text();
    if (parser.feed(decoder.decode(value, { stream: true }))) return parser.text();
  }
}
