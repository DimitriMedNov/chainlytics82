/** Lo justo de un evento de teclado para decidir si es el atajo. */
export interface KeyPress {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
}

/** ⌘K en Mac o Ctrl+K en el resto. Se aceptan los dos en cualquier sistema. */
export function isSearchShortcut(press: KeyPress): boolean {
  if (press.key.toLowerCase() !== "k") return false;
  return press.metaKey || press.ctrlKey;
}

/** true si el nombre de plataforma que da el navegador es de Mac. */
export function isMacPlatform(platform: string): boolean {
  return platform.toLowerCase().includes("mac");
}
