import {
  emptyAnswerError,
  failedStatusError,
  knownStatusError,
} from "@/application/analyst/errors";
import type { AnalystStreamPort } from "@/application/analyst/ports";
import type { AnalystTurn } from "@/domain/analyst/message";
import { readSseText } from "@/infrastructure/analyst/sseText";

/** Cuerpo de la petición a la función `ai-crypto-analyst`. */
interface AnalystRequestDto {
  messages: readonly AnalystTurn[];
}

export interface AnalystStreamClientOptions {
  /** URL del proyecto de Supabase, sin barra final. */
  supabaseUrl: string;
}

/**
 * Cliente de la Edge Function del analista: pide la respuesta y la va leyendo
 * a trozos (SSE). Rechaza con `AnalystError` si el servidor la rechaza o si el
 * modelo no manda texto, y con `AbortError` si se cancela.
 */
export function createAnalystStreamClient({
  supabaseUrl,
}: AnalystStreamClientOptions): AnalystStreamPort {
  const url = `${supabaseUrl}/functions/v1/ai-crypto-analyst`;

  return {
    async stream({ accessToken, messages, signal, onText }) {
      const body: AnalystRequestDto = { messages };
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
        signal,
      });

      const conocido = knownStatusError(resp.status);
      if (conocido) throw conocido;
      if (!resp.ok || !resp.body) throw failedStatusError(resp.status);

      const texto = await readSseText(resp.body, onText);
      // Algunos modelos cierran el stream sin un solo trozo: mejor decirlo que dejar el chat mudo.
      if (texto === "") throw emptyAnswerError();
    },
  };
}
