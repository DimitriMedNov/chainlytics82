import { resolveTheme, type ResolvedTheme } from "../../domain/theme/theme.ts";
import type { SystemThemePort } from "./ports.ts";
import type { ThemeController } from "./themeController.ts";

/**
 * Avisa del tema que se ve de verdad: una vez al empezar y cada vez que cambia
 * el tema elegido. Solo con "system" escucha además al sistema operativo, y
 * deja de escucharlo en cuanto se elige un tema fijo. Devuelve la función que
 * lo apaga todo.
 */
export function watchResolvedTheme(
  controller: ThemeController,
  system: SystemThemePort,
  onChange: (resolved: ResolvedTheme) => void,
): () => void {
  let stopSystem: (() => void) | null = null;

  const emit = () => onChange(resolveTheme(controller.getSnapshot(), system.isDark()));

  const sync = () => {
    const followsSystem = controller.getSnapshot() === "system";
    if (followsSystem && stopSystem === null) {
      stopSystem = system.subscribe(emit);
    } else if (!followsSystem && stopSystem !== null) {
      stopSystem();
      stopSystem = null;
    }
    emit();
  };

  const stopController = controller.subscribe(sync);
  sync();

  return () => {
    stopController();
    stopSystem?.();
    stopSystem = null;
  };
}
