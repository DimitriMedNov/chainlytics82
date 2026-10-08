import type { Credentials } from "@/application/session/credentials";
import type { AuthPort } from "@/application/session/ports";
import { signIn, signOut, signUp } from "@/application/session/useCases";
import type { AccountServiceStatus } from "@/domain/session/session";
import type { Result } from "@/domain/shared/result";
import { createAccountServiceHealth } from "@/infrastructure/session/AccountServiceHealth";
import { createSupabaseAuth } from "@/infrastructure/session/SupabaseAuth";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { AppEnv } from "@/app/env";

export interface SessionModule {
  /** Puerto de cuentas, para suscribirse a los cambios de sesión. */
  auth: AuthPort;
  checkAccountService(): Promise<Exclude<AccountServiceStatus, "checking">>;
  signIn(credentials: Credentials): Promise<Result<void, string>>;
  signUp(credentials: Credentials): Promise<Result<void, string>>;
  signOut(): Promise<Result<void, "unreachable">>;
}

/** Sesión: Supabase Auth y la comprobación de salud del servicio de cuentas. */
export function createSessionModule(env: AppEnv): SessionModule {
  const auth = createSupabaseAuth(supabase, {
    emailRedirectTo: () => `${window.location.origin}/`,
  });
  const accountService = createAccountServiceHealth({
    configured: isSupabaseConfigured,
    url: env.supabaseUrl,
    apiKey: env.supabaseKey,
  });

  return {
    auth,
    checkAccountService: () => accountService.check(),
    signIn: (credentials) => signIn(auth, credentials),
    signUp: (credentials) => signUp(auth, credentials),
    signOut: () => signOut(auth),
  };
}
