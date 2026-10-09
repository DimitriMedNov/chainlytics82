import { useEffect } from "react";
import { useDeps } from "@/app/deps";
import { watchResolvedTheme } from "@/application/theme/watchResolvedTheme";

/**
 * Pone la clase `light` o `dark` en `<html>` según el tema elegido. Con
 * "system" la clase sigue al sistema operativo en vivo. Se llama una sola
 * vez, desde el proveedor visual de la app.
 */
export function useThemeClass(): void {
  const { theme: themeModule } = useDeps();

  useEffect(() => {
    const root = window.document.documentElement;
    return watchResolvedTheme(themeModule.controller, themeModule.system, (resolved) => {
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
    });
  }, [themeModule]);
}
