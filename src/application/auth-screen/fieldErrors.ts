import type { AuthFieldErrors } from "../../domain/auth-screen/form.ts";
import { parseCredentials } from "../session/credentials.ts";

// Valores que el esquema de credenciales siempre acepta. Sirven para validar
// un campo aislado con el mismo esquema (y los mismos mensajes) que usa el
// envío, sin copiar las reglas aquí.
const VALID_EMAIL = "a@b.co";
const VALID_PASSWORD = "000000";

/**
 * Error de validación de cada campo, con el mensaje exacto del esquema de
 * credenciales ("Email inválido", "Mínimo 6 caracteres"...). `null` si vale.
 */
export function validateAuthFields(email: string, password: string): AuthFieldErrors {
  const emailCheck = parseCredentials(email, VALID_PASSWORD);
  const passwordCheck = parseCredentials(VALID_EMAIL, password);
  return {
    email: emailCheck.ok ? null : emailCheck.error,
    password: passwordCheck.ok ? null : passwordCheck.error,
  };
}
