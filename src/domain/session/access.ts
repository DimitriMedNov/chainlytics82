import type { AccountServiceStatus } from "./session.ts";

/**
 * Estado de acceso: la única decisión de "qué le enseño a esta persona" a
 * partir de servicio de cuentas × sesión × cargando. Antes se repetía con
 * ternarios en la barra de navegación, la pantalla de acceso, el aviso de
 * dónde se guardan los datos y el panel del analista.
 *
 * - `signed-in`: hay sesión. Gana siempre, aunque el servicio esté caído.
 * - `checking`: sin sesión y el servicio aún se está comprobando: no se ofrece
 *   nada que dependa de la cuenta.
 * - `signed-out`: sin sesión y el servicio responde: se puede ofrecer entrar.
 * - `unavailable`: sin sesión y sin servicio: se explica por qué (`reason`).
 *
 * `settled` dice si ya se terminó de leer la sesión guardada. La pantalla de
 * acceso espera a que sea `true` antes de pintar el formulario o el aviso; la
 * barra, el aviso de guardado y el analista no esperan.
 */
export type AccessState =
  | { kind: "signed-in"; canSignIn: boolean }
  | { kind: "checking"; canSignIn: false }
  | { kind: "signed-out"; canSignIn: true; settled: boolean }
  | {
      kind: "unavailable";
      canSignIn: false;
      reason: "unconfigured" | "unreachable";
      settled: boolean;
    };

export interface AccessInput {
  service: AccountServiceStatus;
  hasSession: boolean;
  /** true mientras se lee la sesión guardada al arrancar. */
  loading: boolean;
}

export function resolveAccess({ service, hasSession, loading }: AccessInput): AccessState {
  if (hasSession) return { kind: "signed-in", canSignIn: service === "ready" };
  if (service === "checking") return { kind: "checking", canSignIn: false };
  if (service === "ready") return { kind: "signed-out", canSignIn: true, settled: !loading };
  return { kind: "unavailable", canSignIn: false, reason: service, settled: !loading };
}

/** La pantalla de acceso no pinta nada hasta saber servicio y sesión. */
export function isAccessPending(access: AccessState): boolean {
  if (access.kind === "signed-in") return false;
  if (access.kind === "checking") return true;
  return !access.settled;
}
