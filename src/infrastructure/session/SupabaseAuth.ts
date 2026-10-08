import type { Session } from "@supabase/supabase-js";
import type { AuthPort } from "@/application/session/ports";
import type { AuthSession } from "@/domain/session/session";
import { err, ok } from "@/domain/shared/result";
import type { SupabaseDb } from "@/infrastructure/shared/supabaseDb";

export interface SupabaseAuthOptions {
  /** A dónde vuelve el usuario desde el correo de confirmación. */
  emailRedirectTo: () => string;
}

/** Sesión de Supabase → sesión de la app. Los tipos de Supabase se quedan aquí. */
export function toAuthSession(session: Session | null): AuthSession | null {
  if (!session) return null;
  return {
    user: { id: session.user.id, email: session.user.email ?? null },
    accessToken: session.access_token,
  };
}

/** Cuentas con Supabase Auth. */
export function createSupabaseAuth(client: SupabaseDb, options: SupabaseAuthOptions): AuthPort {
  return {
    onSessionChange(listener) {
      const { data } = client.auth.onAuthStateChange((_evento, session) => {
        listener(toAuthSession(session));
      });
      return () => data.subscription.unsubscribe();
    },

    async getSession() {
      const { data } = await client.auth.getSession();
      return toAuthSession(data.session);
    },

    async signOut() {
      await client.auth.signOut();
    },

    async signInWithPassword(email, password) {
      const { error } = await client.auth.signInWithPassword({ email, password });
      return error ? err({ message: error.message }) : ok(undefined);
    },

    async signUp(email, password) {
      const { error } = await client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: options.emailRedirectTo() },
      });
      return error ? err({ message: error.message }) : ok(undefined);
    },
  };
}
