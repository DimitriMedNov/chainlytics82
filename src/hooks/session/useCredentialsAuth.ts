import { useCallback, useState } from "react";
import { parseCredentials, type Credentials } from "@/application/session/credentials";
import { useDeps } from "@/app/deps";
import { err, type Result } from "@/domain/shared/result";

export interface CredentialsAuth {
  /** Valida y entra. El error es el mensaje para el usuario. */
  signIn(email: string, password: string): Promise<Result<void, string>>;
  /** Valida y crea la cuenta. El error es el mensaje para el usuario. */
  signUp(email: string, password: string): Promise<Result<void, string>>;
  /** true mientras se espera la respuesta del servicio de cuentas. */
  busy: boolean;
}

/**
 * Iniciar sesión y registrarse con email y contraseña. Los avisos de éxito
 * (`SIGN_IN_OK`, `SIGN_UP_OK`) y la navegación los pone quien llama.
 */
export function useCredentialsAuth(): CredentialsAuth {
  const { session } = useDeps();
  const [busy, setBusy] = useState(false);

  const submit = useCallback(
    async (
      action: (credentials: Credentials) => Promise<Result<void, string>>,
      email: string,
      password: string,
    ) => {
      // Si lo escrito no vale, no se llega a marcar "ocupado".
      const credentials = parseCredentials(email, password);
      if (!credentials.ok) return err(credentials.error);

      setBusy(true);
      const result = await action(credentials.value);
      setBusy(false);
      return result;
    },
    [],
  );

  const signIn = useCallback(
    (email: string, password: string) => submit(session.signIn, email, password),
    [submit, session],
  );
  const signUp = useCallback(
    (email: string, password: string) => submit(session.signUp, email, password),
    [submit, session],
  );

  return { signIn, signUp, busy };
}
