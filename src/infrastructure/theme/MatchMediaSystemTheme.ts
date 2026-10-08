import type { SystemThemePort } from "@/application/theme/ports";

const QUERY = "(prefers-color-scheme: dark)";

/** Tema del sistema operativo, leído con `matchMedia`. */
export function createMatchMediaSystemTheme(): SystemThemePort {
  return {
    isDark: () => window.matchMedia(QUERY).matches,
    subscribe(listener) {
      const query = window.matchMedia(QUERY);
      query.addEventListener("change", listener);
      return () => query.removeEventListener("change", listener);
    },
  };
}
