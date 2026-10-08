import type { KeyValueStorage } from "@/application/shared/ports";
import type { ThemePreferencePort } from "@/application/theme/ports";
import { isTheme } from "@/domain/theme/theme";

/** Clave bajo la que se guarda el tema elegido. */
export const THEME_STORAGE_KEY = "chainlytics-theme";

/** Preferencia de tema en el almacenamiento del navegador. */
export function createLocalStorageThemePreference(
  storage: KeyValueStorage,
  key: string = THEME_STORAGE_KEY,
): ThemePreferencePort {
  return {
    load() {
      try {
        const stored = storage.getItem(key);
        return isTheme(stored) ? stored : null;
      } catch {
        // Almacenamiento bloqueado: se usa el tema por defecto.
        return null;
      }
    },
    save(theme) {
      try {
        storage.setItem(key, theme);
      } catch {
        // Almacenamiento bloqueado: el tema vale solo hasta recargar.
      }
    },
  };
}
