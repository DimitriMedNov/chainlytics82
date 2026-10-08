import type { AccountServiceStatus, AuthSession } from "../../domain/session/session.ts";
import type { Result } from "../../domain/shared/result.ts";

/** El proveedor de cuentas rechazó la petición; `message` es su texto tal cual. */
export interface AuthFailure {
  message: string;
}

/** Lo que la app necesita del proveedor de cuentas. */
export interface AuthPort {
  /** Avisa cada vez que la sesión cambia. Devuelve la función para dejar de escuchar. */
  onSessionChange(listener: (session: AuthSession | null) => void): () => void;
  /** Sesión guardada, si la hay. */
  getSession(): Promise<AuthSession | null>;
  signOut(): Promise<void>;
  signInWithPassword(email: string, password: string): Promise<Result<void, AuthFailure>>;
  signUp(email: string, password: string): Promise<Result<void, AuthFailure>>;
}

/** Comprueba si el servicio de cuentas existe y responde. Nunca lanza. */
export interface AccountServicePort {
  check(): Promise<Exclude<AccountServiceStatus, "checking">>;
}
