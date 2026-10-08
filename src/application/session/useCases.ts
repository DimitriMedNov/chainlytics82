import { err, ok, type Result } from "../../domain/shared/result.ts";
import type { Credentials } from "./credentials.ts";
import type { AuthPort } from "./ports.ts";

/** Mensajes de éxito que enseña quien llama. */
export const SIGN_IN_OK = "¡Bienvenido!";
export const SIGN_UP_OK = "Cuenta creada. Revisa tu correo para confirmarla.";

/**
 * Inicia sesión. El error es el mensaje para el usuario.
 */
// Conservado: solo se traduce "Invalid login credentials"; el resto de errores
// del proveedor salen tal cual, en inglés (inventario §9, punto 12).
export async function signIn(
  auth: AuthPort,
  credentials: Credentials,
): Promise<Result<void, string>> {
  const result = await auth.signInWithPassword(credentials.email, credentials.password);
  if (result.ok) return ok(undefined);
  const { message } = result.error;
  return err(message === "Invalid login credentials" ? "Credenciales incorrectas" : message);
}

/** Crea la cuenta. El proveedor envía un correo de confirmación. */
// Conservado: solo se traduce el caso del email repetido (inventario §9, punto 12).
export async function signUp(
  auth: AuthPort,
  credentials: Credentials,
): Promise<Result<void, string>> {
  const result = await auth.signUp(credentials.email, credentials.password);
  if (result.ok) return ok(undefined);
  const { message } = result.error;
  return err(message.includes("already") ? "Ese email ya está registrado" : message);
}

/**
 * Cierra la sesión. Si el servicio no responde devuelve error para que quien
 * llama limpie al menos la sesión local.
 */
export async function signOut(auth: AuthPort): Promise<Result<void, "unreachable">> {
  try {
    await auth.signOut();
    return ok(undefined);
  } catch {
    return err("unreachable");
  }
}
