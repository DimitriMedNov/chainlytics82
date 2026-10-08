import { askAnalyst, type AskAnalystRequest } from "@/application/analyst/useCases";
import { createAnalystStreamClient } from "@/infrastructure/analyst/AnalystStreamClient";
import type { BaseDeps } from "@/app/base";
import { readEnv, type AppEnv } from "@/app/env";

/**
 * Analista IA: cliente del stream de la función `ai-crypto-analyst` y caso de
 * uso «preguntar al analista». Llega a los hooks con `useDeps().analyst`.
 *
 * `BaseDeps` no trae la URL de Supabase y `container.ts` solo pasa `base`, así
 * que el entorno se pide a `readEnv()` (que sigue siendo el único sitio que
 * lee `import.meta.env`). Si `container.ts` pasa `env`, se usa ese.
 */
export function createAnalystModule(_base: BaseDeps, env: AppEnv = readEnv()) {
  const client = createAnalystStreamClient({ supabaseUrl: env.supabaseUrl });

  return {
    /** Envía la conversación y va entregando la respuesta; cancelable con `signal`. */
    ask: (request: AskAnalystRequest) => askAnalyst(client, request),
  };
}
