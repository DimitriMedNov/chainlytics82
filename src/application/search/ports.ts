/** Lo que el buscador necesita saber del equipo donde corre. Ningún método lanza. */
export interface PlatformPort {
  /** true en Mac: decide si el atajo se enseña como «⌘K» o «Ctrl K». */
  isMac(): boolean;
}
