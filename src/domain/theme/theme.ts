/** Preferencia de tema. `system` sigue al sistema operativo. */
export type Theme = "dark" | "light" | "system";

/** El tema que se ve de verdad. */
export type ResolvedTheme = "dark" | "light";

/** Sin preferencia guardada, la app arranca en oscuro. */
export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light" || value === "system";
}

export function resolveTheme(theme: Theme, systemIsDark: boolean): ResolvedTheme {
  if (theme === "system") return systemIsDark ? "dark" : "light";
  return theme;
}
