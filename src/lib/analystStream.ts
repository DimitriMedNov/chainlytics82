/** Mensaje del chat con el analista. `id` sirve de `key` estable en la lista. */
export interface AnalystMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/** Fallo con un mensaje ya pensado para enseñárselo a la persona. */
export class AnalystError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null) {
    super(message);
    this.name = "AnalystError";
    this.status = status;
  }
}

const MENSAJES_POR_ESTADO: Record<number, string> = {
  401: "Sesión expirada. Inicia sesión nuevamente.",
  402: "Créditos de IA agotados. Agrega fondos en tu workspace.",
  403: "No tienes permisos para usar la IA.",
  429: "Demasiadas solicitudes. Intenta en un momento.",
};

/** Saca el trozo de texto de una línea `data: {...}` del streaming de OpenAI. */
function deltaDe(json: string): string | null {
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

interface StreamOptions {
  accessToken: string;
  messages: ReadonlyArray<Pick<AnalystMessage, "role" | "content">>;
  signal: AbortSignal;
  /** Se llama con el texto acumulado cada vez que llega un trozo. */
  onText: (acumulado: string) => void;
}

/**
 * Pide la respuesta a la Edge Function y la va leyendo a trozos (SSE).
 * Lanza `AnalystError` si el servidor la rechaza o si el modelo no manda texto,
 * y `AbortError` si se cancela.
 */
export async function streamAnalyst({ accessToken, messages, signal, onText }: StreamOptions) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-crypto-analyst`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  const conocido = MENSAJES_POR_ESTADO[resp.status];
  if (conocido) throw new AnalystError(conocido, resp.status);
  if (!resp.ok || !resp.body) {
    throw new AnalystError("No se pudo obtener respuesta de la IA", resp.status);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let acc = "";

  const sinTexto = () => {
    // Algunos modelos cierran el stream sin un solo trozo: mejor decirlo que dejar el chat mudo.
    if (acc === "") throw new AnalystError("La IA no devolvió ninguna respuesta. Prueba otra vez.", null);
  };

  for (;;) {
    const { value, done } = await reader.read();
    if (done) return sinTexto();
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") return sinTexto();
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
  }
}
