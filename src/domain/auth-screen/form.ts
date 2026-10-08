/** Pestaña del formulario de acceso. */
export type AuthTab = "signin" | "signup";

export const AUTH_TABS: readonly AuthTab[] = ["signin", "signup"];

/** Pestaña con la que se abre la pantalla. */
export const DEFAULT_AUTH_TAB: AuthTab = "signin";

export function isAuthTab(value: string): value is AuthTab {
  return value === "signin" || value === "signup";
}

/** Campos del formulario. */
export type AuthField = "email" | "password";

/** Mensaje de validación de cada campo; `null` si el campo vale. */
export type AuthFieldErrors = Readonly<Record<AuthField, string | null>>;

export const NO_FIELD_ERRORS: AuthFieldErrors = { email: null, password: null };

/** Aviso flotante que debe lanzar la interfaz tras enviar el formulario. */
export interface AuthNotice {
  kind: "success" | "error";
  text: string;
}

/** Qué hacer tras enviar: qué aviso lanzar y a dónde navegar (con `replace`). */
export interface AuthSubmitOutcome {
  notice: AuthNotice;
  /** Ruta a la que navegar sustituyendo la entrada del historial; `null` si no se navega. */
  navigateTo: string | null;
}
