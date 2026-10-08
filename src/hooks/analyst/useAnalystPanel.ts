import { useCallback, useState } from "react";

export interface AnalystPanelState {
  /** El panel está a la vista. */
  open: boolean;
  /**
   * Se abrió alguna vez: desde entonces el panel se queda montado, así la
   * conversación sobrevive a cerrarlo y a cambiar de ruta (se pierde al recargar).
   */
  everOpened: boolean;
  /** Para el botón flotante. */
  openPanel: () => void;
  /** Para el `onOpenChange` del panel. */
  setOpen: (open: boolean) => void;
  /** Para lo que navega fuera (el botón de iniciar sesión). */
  closePanel: () => void;
}

/** Abierto/cerrado del panel del analista y si hay que descargarlo ya. */
export function useAnalystPanel(): AnalystPanelState {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  const openPanel = useCallback(() => {
    setEverOpened(true);
    setOpen(true);
  }, []);
  const closePanel = useCallback(() => setOpen(false), []);

  return { open, everOpened, openPanel, setOpen, closePanel };
}
