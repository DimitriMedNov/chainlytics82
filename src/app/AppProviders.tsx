import { useState, type ReactNode } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { createContainer, type Deps } from "@/app/container";
import { DepsContext } from "@/app/deps";
import { readEnv } from "@/app/env";
import { createQueryClient } from "@/app/queryClient";
import { SessionProvider } from "@/hooks/session/SessionProvider";

export interface AppProvidersProps {
  children: ReactNode;
  /** Solo para pruebas: dependencias simuladas en vez de las reales. */
  deps?: Deps;
  /** Solo para pruebas: un cliente de react-query propio. */
  queryClient?: QueryClient;
}

/**
 * Proveedor raíz de datos del front nuevo: react-query, las dependencias
 * montadas y la sesión. Va por fuera del router y de los proveedores visuales
 * (tema, tooltips, avisos).
 */
export function AppProviders({ children, deps, queryClient }: AppProvidersProps) {
  // Se crean una sola vez por montaje de la app.
  const [client] = useState(() => queryClient ?? createQueryClient());
  const [container] = useState(() => deps ?? createContainer(readEnv()));

  return (
    <QueryClientProvider client={client}>
      <DepsContext.Provider value={container}>
        <SessionProvider>{children}</SessionProvider>
      </DepsContext.Provider>
    </QueryClientProvider>
  );
}
