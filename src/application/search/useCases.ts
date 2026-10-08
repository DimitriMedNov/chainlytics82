import type { PlatformPort } from "./ports.ts";

/** El atajo tal como se enseña en el botón de la barra. */
export interface ShortcutHint {
  isMac: boolean;
  /** «⌘» en Mac, «Ctrl » (con espacio) en el resto. Va delante de `key`. */
  modifier: string;
  key: string;
  /** Las dos partes juntas: «⌘K» o «Ctrl K». */
  label: string;
}

export interface SearchUseCases {
  getShortcutHint(): ShortcutHint;
}

/** Casos de uso del buscador global. Reciben el puerto; no conocen el navegador. */
export function createSearchUseCases(platform: PlatformPort): SearchUseCases {
  return {
    getShortcutHint() {
      const isMac = platform.isMac();
      const modifier = isMac ? "⌘" : "Ctrl ";
      return { isMac, modifier, key: "K", label: `${modifier}K` };
    },
  };
}
