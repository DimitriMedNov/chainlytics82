import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useDeps } from "@/app/deps";
import { resolveAccess } from "@/domain/session/access";
import type { AccountServiceStatus, AuthSession } from "@/domain/session/session";
import { SessionContext, type SessionValue } from "@/hooks/session/SessionContext";

export interface SessionProviderProps {
  children: ReactNode;
}

/** Mantiene la sesión y el estado del servicio de cuentas para toda la app. */
export function SessionProvider({ children }: SessionProviderProps) {
  const { session: sessionModule } = useDeps();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<AccountServiceStatus>("checking");
  const [isRecheckingService, setIsRecheckingService] = useState(false);
  // Número de la última comprobación lanzada: una respuesta que llegue con un
  // número anterior (o tras desmontar) se ignora.
  const lastCheck = useRef(0);

  /** Pregunta al servicio y guarda la respuesta. Devuelve false si llegó tarde. */
  const checkService = useCallback(async (): Promise<boolean> => {
    const id = ++lastCheck.current;
    const estado = await sessionModule.checkAccountService();
    if (id !== lastCheck.current) return false;
    setService(estado);
    return true;
  }, [sessionModule]);

  /** Da por caducada cualquier comprobación que siga en curso. */
  const discardPendingChecks = useCallback(() => {
    lastCheck.current++;
  }, []);

  /**
   * Vuelve a comprobar el servicio de cuentas (botón "Reintentar"). `service`
   * conserva su valor mientras tanto: no vuelve a "checking".
   */
  const recheckService = useCallback(async () => {
    setIsRecheckingService(true);
    // Si llegó tarde, o hay otra comprobación más nueva en curso (ella apagará
    // el indicador) o el proveedor ya se desmontó.
    if (await checkService()) setIsRecheckingService(false);
  }, [checkService]);

  useEffect(() => {
    let cancelado = false;

    // Comprobamos el servicio antes de ofrecer nada que dependa de él.
    // Conservado: sola, la app lo comprueba una vez por carga de página
    // (inventario §9, punto 10); después solo se repite con `recheckService`.
    void checkService();

    // Listener primero, luego getSession (orden recomendado).
    // Conservado: el listener no mira `cancelado` (inventario §9, punto 11).
    const unsubscribe = sessionModule.auth.onSessionChange((next) => {
      setSession(next);
    });
    sessionModule.auth
      .getSession()
      .then((stored) => {
        if (!cancelado) setSession(stored);
      })
      .catch(() => {
        // Sin servicio no hay sesión; el estado del servicio ya lo explica.
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
      discardPendingChecks();
      unsubscribe();
    };
  }, [sessionModule, checkService, discardPendingChecks]);

  const signOut = useCallback(async () => {
    const result = await sessionModule.signOut();
    // Si el servicio no responde, al menos limpiamos la sesión local.
    if (!result.ok) setSession(null);
  }, [sessionModule]);

  const value = useMemo<SessionValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      service,
      canSignIn: service === "ready",
      access: resolveAccess({ service, hasSession: session !== null, loading }),
      signOut,
      recheckService,
      isRecheckingService,
    }),
    [session, loading, service, signOut, recheckService, isRecheckingService],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
