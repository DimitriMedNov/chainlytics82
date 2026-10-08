import { useEffect } from "react";
import { useDeps } from "@/app/deps";
import { resolveTheme } from "@/domain/theme/theme";
import { useTheme } from "@/hooks/theme/useTheme";

/**
 * Pone la clase `light` o `dark` en `<html>` según el tema elegido. Se llama
 * una sola vez, desde el proveedor visual de la app.
 */
export function useThemeClass(): void {
  const { theme: themeModule } = useDeps();
  const { theme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    // Conservado: con "system" la clase se calcula al elegirlo y no sigue los
    // cambios del sistema operativo hasta recargar o volver a cambiar de tema.
    root.classList.add(resolveTheme(theme, themeModule.system.isDark()));
  }, [theme, themeModule]);
}
