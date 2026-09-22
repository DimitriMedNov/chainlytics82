import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Devuelve el tema que se está viendo de verdad ("dark" o "light"),
 * resolviendo "system" y escuchando los cambios del sistema operativo.
 */
export function useResolvedTheme(): "dark" | "light" {
  const { theme } = useTheme();
  const [systemIsDark, setSystemIsDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => setSystemIsDark(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (theme === "system") return systemIsDark ? "dark" : "light";
  return theme;
}
