import { isSupabaseConfigured } from "@/integrations/supabase/client";

/**
 * En qué estado está el servicio de cuentas.
 * - `checking`: aún comprobando.
 * - `ready`: responde, se puede iniciar sesión.
 * - `unconfigured`: faltan las variables de entorno.
 * - `unreachable`: configurado pero no contesta (proyecto borrado, pausado o
 *   sin conexión).
 */
export type BackendStatus = "checking" | "ready" | "unconfigured" | "unreachable";

const TIMEOUT_MS = 6_000;

/**
 * Pregunta al endpoint de salud de Supabase. No necesita sesión ni permisos:
 * solo sirve para saber si el proyecto existe y responde.
 */
export async function checkBackend(): Promise<BackendStatus> {
  if (!isSupabaseConfigured) return "unconfigured";

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/health`, {
      signal: controller.signal,
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    });
    // Cualquier respuesta sirve: significa que el proyecto está ahí.
    return response.status < 500 ? "ready" : "unreachable";
  } catch {
    return "unreachable";
  } finally {
    window.clearTimeout(timer);
  }
}
