import { createContext, useContext } from "react";
import type { Deps } from "@/app/container";

export const DepsContext = createContext<Deps | null>(null);

/**
 * Casos de uso y puertos ya montados. Solo lo llaman los hooks de
 * `src/hooks/<funcionalidad>/`; los componentes usan esos hooks.
 */
export function useDeps(): Deps {
  const deps = useContext(DepsContext);
  if (deps === null) {
    throw new Error("useDeps se usó fuera de <AppProviders>.");
  }
  return deps;
}
