import type { AccountServicePort } from "@/application/session/ports";

export interface AccountServiceConfig {
  /** false si faltan las variables de entorno del servicio. */
  configured: boolean;
  url: string;
  apiKey: string;
}

const TIMEOUT_MS = 6_000;

/**
 * Pregunta al endpoint de salud de Supabase. No necesita sesión ni permisos:
 * solo sirve para saber si el proyecto existe y responde.
 */
export function createAccountServiceHealth(config: AccountServiceConfig): AccountServicePort {
  return {
    async check() {
      if (!config.configured) return "unconfigured";

      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const response = await fetch(`${config.url}/auth/v1/health`, {
          signal: controller.signal,
          headers: { apikey: config.apiKey },
        });
        // Cualquier respuesta sirve: significa que el proyecto está ahí.
        return response.status < 500 ? "ready" : "unreachable";
      } catch {
        return "unreachable";
      } finally {
        window.clearTimeout(timer);
      }
    },
  };
}
