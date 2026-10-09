import { useCallback, useState } from "react";

export interface FollowBeat {
  /** Número de veces que el usuario ha pulsado «Seguir» en esta moneda. Sirve de `key` del efecto. */
  beat: number;
  /** `true` si la moneda está seguida porque el usuario acaba de pulsar (no porque ya lo estaba al abrir). */
  celebrate: boolean;
  /** Lo que va en el `onClick`: cuenta la pulsación y llama a la acción de siempre. */
  press: () => void;
}

interface BeatState {
  coinKey: string;
  beat: number;
}

/**
 * Pulso del botón de seguimiento (patrón del bloque «Like» de Bencho: el
 * efecto vive en una capa con `key` = pulsación, así cada «Seguir» lo
 * reproduce una sola vez). No decide nada: la acción sigue siendo `onToggle`.
 *
 * El pulso vuelve a 0 al cambiar de moneda, para que abrir una moneda que ya
 * estaba seguida no dispare la confirmación.
 */
export function useFollowBeat(coinKey: string, isFollowing: boolean, onToggle: () => void): FollowBeat {
  const [state, setState] = useState<BeatState>({ coinKey, beat: 0 });

  // Estado derivado de props: se ajusta durante el render, sin efecto.
  if (state.coinKey !== coinKey) setState({ coinKey, beat: 0 });
  const beat = state.coinKey === coinKey ? state.beat : 0;

  const press = useCallback(() => {
    if (!isFollowing) {
      setState((prev) => ({ coinKey, beat: prev.coinKey === coinKey ? prev.beat + 1 : 1 }));
    }
    onToggle();
  }, [coinKey, isFollowing, onToggle]);

  return { beat, celebrate: isFollowing && beat > 0, press };
}
