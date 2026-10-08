import type { AccessState } from "../session/access.ts";

/**
 * Qué se enseña antes de la conversación:
 * - `signin`: invitación a iniciar sesión.
 * - `unavailable`: aviso de que el servicio no responde.
 * - `welcome`: saludo con el nombre y las sugerencias.
 * - `null`: nada (servicio aún comprobándose, o ya hay conversación).
 */
export type AnalystIntroKind = "signin" | "unavailable" | "welcome";

export function resolveAnalystIntro(
  access: AccessState,
  messageCount: number,
): AnalystIntroKind | null {
  switch (access.kind) {
    // Conservado: con sesión no se mira el servicio; si está caído se enseña
    // la bienvenida y el formulario como si funcionara (inventario §9, punto 18).
    case "signed-in":
      return messageCount === 0 ? "welcome" : null;
    // Sin sesión la intro sale aunque haya mensajes (pasa tras un 401, que
    // cierra la sesión con la conversación en pantalla).
    case "signed-out":
      return "signin";
    case "unavailable":
      return "unavailable";
    case "checking":
      return null;
  }
}

/** El formulario de preguntar solo existe con sesión. */
export function canAskAnalyst(access: AccessState): boolean {
  return access.kind === "signed-in";
}

/** Nombre del saludo: lo que va antes de la @ del correo. */
export function analystUserName(email: string | null | undefined): string | undefined {
  return email?.split("@")[0];
}

/** Saludo de la bienvenida: «Hola, ana» o «Hola» si no hay nombre. */
export function analystGreeting(userName: string | undefined): string {
  return `Hola${userName ? `, ${userName}` : ""}`;
}
