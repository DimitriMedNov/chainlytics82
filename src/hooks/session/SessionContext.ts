import { createContext } from "react";
import type { AccessState } from "@/domain/session/access";
import type { AccountServiceStatus, AuthSession, SessionUser } from "@/domain/session/session";

export interface SessionValue {
  session: AuthSession | null;
  user: SessionUser | null;
  /** true mientras se lee la sesión guardada al arrancar. */
  loading: boolean;
  /** Estado del servicio de cuentas: sin él no hay sesión posible. */
  service: AccountServiceStatus;
  /** Atajo: true cuando de verdad se puede iniciar sesión. */
  canSignIn: boolean;
  /** Qué enseñar a esta persona, ya decidido (ver `resolveAccess`). */
  access: AccessState;
  signOut: () => Promise<void>;
  /**
   * Vuelve a comprobar el servicio de cuentas y actualiza `service` con la
   * respuesta. Mientras tanto `service` conserva su valor (no pasa a "checking").
   */
  recheckService: () => Promise<void>;
  /** true mientras `recheckService` espera la respuesta. */
  isRecheckingService: boolean;
}

export const SessionContext = createContext<SessionValue>({
  session: null,
  user: null,
  loading: true,
  service: "checking",
  canSignIn: false,
  access: { kind: "checking", canSignIn: false },
  signOut: async () => {},
  recheckService: async () => {},
  isRecheckingService: false,
});
