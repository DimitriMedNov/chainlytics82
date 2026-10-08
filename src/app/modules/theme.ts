import type { KeyValueStorage } from "@/application/shared/ports";
import type { SystemThemePort } from "@/application/theme/ports";
import { createThemeController, type ThemeController } from "@/application/theme/themeController";
import { createLocalStorageThemePreference } from "@/infrastructure/theme/LocalStorageThemePreference";
import { createMatchMediaSystemTheme } from "@/infrastructure/theme/MatchMediaSystemTheme";

export interface ThemeModule {
  /** El tema elegido (oscuro por defecto), guardado en `chainlytics-theme`. */
  controller: ThemeController;
  system: SystemThemePort;
}

export function createThemeModule(storage: KeyValueStorage): ThemeModule {
  return {
    controller: createThemeController(createLocalStorageThemePreference(storage)),
    system: createMatchMediaSystemTheme(),
  };
}
