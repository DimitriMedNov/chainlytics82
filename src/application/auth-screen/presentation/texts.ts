import type { AuthField, AuthTab } from "../../../domain/auth-screen/form.ts";

/** Cabecera de la tarjeta de acceso. */
// Conservado: el texto solo menciona el analista, aunque la cuenta también
// sincroniza watchlist y portfolio (inventario §9, punto 12).
export const AUTH_CARD_TEXT = {
  title: "Accede a Chainlytics",
  description: "Inicia sesión para usar el analista de criptomonedas con IA",
} as const;

/** Texto de cada pestaña y de su botón de enviar. */
export const AUTH_TAB_TEXT: Readonly<Record<AuthTab, { label: string; submit: string }>> = {
  signin: { label: "Iniciar sesión", submit: "Entrar" },
  signup: { label: "Crear cuenta", submit: "Crear cuenta" },
};

/** Etiqueta y tipo de `<input>` de cada campo. Los dos son obligatorios. */
export const AUTH_FIELD_TEXT: Readonly<
  Record<AuthField, { label: string; inputType: "email" | "password" }>
> = {
  email: { label: "Email", inputType: "email" },
  password: { label: "Contraseña", inputType: "password" },
};

/** Etiqueta para lectores de pantalla del esqueleto, mientras se comprueba la sesión. */
export const AUTH_CHECKING_LABEL = "Comprobando tu sesión";

/** Lo que se pierde en /auth cuando no hay servicio de cuentas. */
export const AUTH_UNAVAILABLE_WHAT = "no puedes iniciar sesión ni usar el analista con IA";

/** Aviso que sustituye al formulario cuando no hay servicio de cuentas. */
export interface AccountServiceNotice {
  /** Qué icono corresponde: engranaje (falta configurar) o nube tachada (no responde). */
  icon: "settings" | "cloud-off";
  title: string;
  description: string;
  /** Frase "Mientras tanto, {what}. El resto…", partida para poder resaltar `what`. */
  meanwhile: { before: string; what: string; after: string };
  /** Bloque de código con el arreglo; solo cuando falta configurar. */
  command: string | null;
}

/**
 * Textos del aviso de servicio de cuentas caído. Distingue "falta
 * configurarlo" de "está configurado pero no responde", que se arreglan de
 * formas distintas. `what` es lo que no se puede hacer mientras tanto.
 */
export function accountServiceNotice(
  reason: "unconfigured" | "unreachable",
  what: string = AUTH_UNAVAILABLE_WHAT,
): AccountServiceNotice {
  const meanwhile = {
    before: "Mientras tanto, ",
    what,
    after: ". El resto de la app funciona con normalidad: los precios no necesitan cuenta.",
  };
  if (reason === "unconfigured") {
    return {
      icon: "settings",
      title: "El servicio de cuentas no está configurado",
      description: "Faltan las variables de Supabase en el archivo .env.",
      meanwhile,
      command: "cp .env.example .env\n# y rellena los tres valores",
    };
  }
  return {
    icon: "cloud-off",
    title: "El servicio de cuentas no responde",
    description:
      "El proyecto de Supabase configurado no contesta. Puede estar pausado, borrado, o puede que no haya conexión.",
    meanwhile,
    command: null,
  };
}
