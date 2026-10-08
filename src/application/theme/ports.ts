import type { Theme } from "../../domain/theme/theme.ts";

/** Dónde se guarda la preferencia de tema. Ninguno de los dos métodos lanza. */
export interface ThemePreferencePort {
  /** null si no hay nada guardado o no se puede leer. */
  load(): Theme | null;
  save(theme: Theme): void;
}

/** Si el sistema operativo está en oscuro, y un aviso cuando cambia. */
export interface SystemThemePort {
  isDark(): boolean;
  subscribe(listener: () => void): () => void;
}
