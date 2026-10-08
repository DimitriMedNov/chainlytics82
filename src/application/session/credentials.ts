import { z } from "zod";
import { err, ok, type Result } from "../../domain/shared/result.ts";

const credSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

/** Email y contraseña ya validados (el email, sin espacios alrededor). */
export type Credentials = z.infer<typeof credSchema>;

/**
 * Valida lo que escribió el usuario. Si no vale, el error es el mensaje del
 * primer fallo, listo para enseñar.
 */
export function parseCredentials(email: string, password: string): Result<Credentials, string> {
  const parsed = credSchema.safeParse({ email, password });
  if (!parsed.success) return err(parsed.error.issues[0].message);
  return ok(parsed.data);
}
