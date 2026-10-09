import { useEffect, useState } from "react";

export interface PalettePresenceMarkerProps {
  onPresenceChange: (present: boolean) => void;
}

/**
 * Va dentro del contenido de la paleta: avisa cuando este se monta y cuando
 * se retira de la página, que es justo al terminar su animación de salida.
 */
export function PalettePresenceMarker({ onPresenceChange }: PalettePresenceMarkerProps) {
  useEffect(() => {
    onPresenceChange(true);
    return () => onPresenceChange(false);
  }, [onPresenceChange]);

  return null;
}

export interface DetailAfterPalette {
  /** El detalle ya se puede enseñar. */
  detailShown: boolean;
  /** Para `<PalettePresenceMarker>`. */
  onPalettePresenceChange: (present: boolean) => void;
}

/**
 * Paso paleta → detalle sin solaparse: el detalle espera a que la paleta haya
 * salido del todo (sin temporizador: lo dice la propia paleta al retirarse).
 * Una vez enseñado, volver a abrir la paleta encima no lo esconde.
 *
 * @param wanted si el detalle debería estar en pantalla (abierto o cargando).
 */
export function useDetailAfterPalette(wanted: boolean): DetailAfterPalette {
  const [palettePresent, setPalettePresent] = useState(false);
  const [released, setReleased] = useState(false);

  // Estado derivado: se ajusta durante el render, sin efecto.
  if (wanted && !palettePresent && !released) setReleased(true);
  if (!wanted && released) setReleased(false);

  return { detailShown: wanted && (released || !palettePresent), onPalettePresenceChange: setPalettePresent };
}
