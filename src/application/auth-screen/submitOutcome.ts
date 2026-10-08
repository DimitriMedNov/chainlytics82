import type { AuthSubmitOutcome, AuthTab } from "../../domain/auth-screen/form.ts";
import { AUTH_HOME_PATH } from "../../domain/auth-screen/mode.ts";
import type { Result } from "../../domain/shared/result.ts";
import { SIGN_IN_OK, SIGN_UP_OK } from "../session/useCases.ts";

/**
 * Traduce el resultado de entrar o registrarse a lo que debe hacer la
 * interfaz: qué aviso lanzar y si hay que navegar.
 *
 * - Entrar bien: "¡Bienvenido!" y a la portada.
 * - Registrarse bien: "Cuenta creada. Revisa tu correo para confirmarla." y
 *   no se navega (falta confirmar el correo).
 * - Cualquier fallo: el mensaje tal cual, sin navegar.
 */
// Conservado: los errores del proveedor de cuentas no previstos llegan en
// inglés y así se enseñan (inventario §9, punto 12).
export function authSubmitOutcome(tab: AuthTab, result: Result<void, string>): AuthSubmitOutcome {
  if (!result.ok) return { notice: { kind: "error", text: result.error }, navigateTo: null };
  if (tab === "signin") {
    return { notice: { kind: "success", text: SIGN_IN_OK }, navigateTo: AUTH_HOME_PATH };
  }
  return { notice: { kind: "success", text: SIGN_UP_OK }, navigateTo: null };
}
