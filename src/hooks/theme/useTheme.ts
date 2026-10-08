import { useSyncExternalStore } from "react";
import { useDeps } from "@/app/deps";
import { resolveTheme, type ResolvedTheme, type Theme } from "@/domain/theme/theme";

export interface ThemeState {
  /** Lo elegido: "dark", "light" o "system". Por defecto, "dark". */
  theme: Theme;
  /** Lo que se ve de verdad, con "system" ya resuelto y al día con el sistema operativo. */
  resolvedTheme: ResolvedTheme;
  /** Cambia el tema y lo guarda en este navegador. */
  setTheme: (theme: Theme) => void;
}

/** Tema de la app. No necesita proveedor propio: todos leen el mismo almacén. */
export function useTheme(): ThemeState {
  const { theme: themeModule } = useDeps();
  const theme = useSyncExternalStore(themeModule.controller.subscribe, themeModule.controller.getSnapshot);
  const systemIsDark = useSyncExternalStore(themeModule.system.subscribe, themeModule.system.isDark);

  return {
    theme,
    resolvedTheme: resolveTheme(theme, systemIsDark),
    setTheme: themeModule.controller.setTheme,
  };
}
