/** El usuario tal como lo ve la app. Los tipos de Supabase no salen de `infrastructure`. */
export interface SessionUser {
  id: string;
  /** null si el proveedor de cuentas no lo da. */
  email: string | null;
}

/** Sesión iniciada. */
export interface AuthSession {
  user: SessionUser;
  /** Credencial que se envía al servidor (la usa el analista con IA). */
  accessToken: string;
}

/**
 * En qué estado está el servicio de cuentas.
 * - `checking`: aún comprobando.
 * - `ready`: responde, se puede iniciar sesión.
 * - `unconfigured`: faltan las variables de entorno.
 * - `unreachable`: configurado pero no contesta (proyecto borrado, pausado o
 *   sin conexión).
 */
export type AccountServiceStatus = "checking" | "ready" | "unconfigured" | "unreachable";
