/** Portapapeles del sistema. `writeText` lanza si el navegador lo bloquea. */
export interface ClipboardPort {
  writeText(text: string): Promise<void>;
}
