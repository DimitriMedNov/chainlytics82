import { DEFAULT_THEME, type Theme } from "../../domain/theme/theme.ts";
import type { ThemePreferencePort } from "./ports.ts";

/** El tema elegido, observable: todos los que lo leen se enteran al cambiar. */
export interface ThemeController {
  getSnapshot(): Theme;
  subscribe(listener: () => void): () => void;
  /** Guarda la preferencia y avisa. */
  setTheme(theme: Theme): void;
}

/** Arranca con lo guardado o, si no hay nada, con el tema por defecto (oscuro). */
export function createThemeController(
  preference: ThemePreferencePort,
  defaultTheme: Theme = DEFAULT_THEME,
): ThemeController {
  let current: Theme = preference.load() ?? defaultTheme;
  const listeners = new Set<() => void>();

  return {
    getSnapshot: () => current,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setTheme(theme) {
      preference.save(theme);
      current = theme;
      listeners.forEach((listener) => listener());
    },
  };
}
