import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { checkBackend, type BackendStatus } from "@/lib/backendStatus";

interface AuthCtx {
  session: Session | null;
  user: User | null;
  loading: boolean;
  /** Estado del servicio de cuentas: sin él no hay sesión posible. */
  backend: BackendStatus;
  /** Atajo: true cuando de verdad se puede iniciar sesión. */
  canSignIn: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  session: null,
  user: null,
  loading: true,
  backend: "checking",
  canSignIn: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [backend, setBackend] = useState<BackendStatus>("checking");

  useEffect(() => {
    let cancelado = false;

    // Comprobamos el servicio antes de ofrecer nada que dependa de él.
    void checkBackend().then((estado) => {
      if (!cancelado) setBackend(estado);
    });

    // Listener primero, luego getSession (orden recomendado).
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => {
      setSession(s);
    });
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!cancelado) setSession(data.session);
      })
      .catch(() => {
        // Sin servicio no hay sesión; el estado del backend ya lo explica.
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Si el servicio no responde, al menos limpiamos la sesión local.
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        backend,
        canSignIn: backend === "ready",
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
