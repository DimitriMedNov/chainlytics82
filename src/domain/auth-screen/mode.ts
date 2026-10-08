import { isAccessPending, type AccessState } from "../session/access.ts";

/** Ruta a la que se va cuando ya hay sesión. */
export const AUTH_HOME_PATH = "/";

/**
 * Qué pinta la pantalla de acceso (/auth), como estado único:
 *
 * - `checking`: aún no se sabe si hay sesión o si el servicio de cuentas
 *   responde. Antes era una pantalla en blanco; ahí va el esqueleto.
 * - `unavailable`: sin sesión y sin servicio de cuentas: aviso en lugar del
 *   formulario (`reason` dice si falta configurarlo o si no responde).
 * - `signed-in`: hay sesión: no se pinta nada, se redirige a `redirectTo`.
 * - `form`: tarjeta con las pestañas de entrar y registrarse.
 */
export type AuthScreenMode =
  | { kind: "checking" }
  | { kind: "unavailable"; reason: "unconfigured" | "unreachable" }
  | { kind: "signed-in"; redirectTo: typeof AUTH_HOME_PATH }
  | { kind: "form" };

/**
 * Decide el modo a partir del estado de acceso. Sustituye a los tres `if` de
 * `pages/Auth.tsx` y a su redirección duplicada (un `useEffect` y un
 * `<Navigate>`): la sesión gana siempre, incluso mientras se comprueba el
 * servicio.
 */
export function resolveAuthScreenMode(access: AccessState): AuthScreenMode {
  if (access.kind === "signed-in") return { kind: "signed-in", redirectTo: AUTH_HOME_PATH };
  if (isAccessPending(access)) return { kind: "checking" };
  if (access.kind === "unavailable") return { kind: "unavailable", reason: access.reason };
  return { kind: "form" };
}

/** La única señal de redirección: la ruta, o `null` si no hay que moverse. */
export function authRedirectTarget(mode: AuthScreenMode): string | null {
  return mode.kind === "signed-in" ? mode.redirectTo : null;
}
