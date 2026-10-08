import type { ClipboardPort } from "@/application/converter/ports";

/** Portapapeles del navegador (`navigator.clipboard`). */
export function createNavigatorClipboard(): ClipboardPort {
  return {
    // Si el navegador no ofrece portapapeles (contexto no seguro), el acceso
    // lanza igual que antes y el caso de uso lo convierte en aviso.
    writeText: async (text) => {
      await navigator.clipboard.writeText(text);
    },
  };
}
