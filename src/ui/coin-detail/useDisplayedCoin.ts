import { useState } from "react";
import type { Coin } from "@/domain/market/coin";

/**
 * La moneda que se pinta. Quien abre el modal suele pasar `coin = null` en el
 * mismo instante en que lo cierra; mientras dura la animación de salida se
 * sigue pintando lo último que se vio abierto, para que nada cambie al irse:
 * ni el contenido por el esqueleto, ni el esqueleto por una moneda anterior.
 * Abierto y sin moneda (el buscador aún la está trayendo) devuelve `null`.
 */
export function useDisplayedCoin(coin: Coin | null, open: boolean): Coin | null {
  const [shownWhileOpen, setShownWhileOpen] = useState<Coin | null>(coin);

  // Estado derivado de props: se ajusta durante el render, sin efecto.
  if (open && coin !== shownWhileOpen) setShownWhileOpen(coin);

  return open ? coin : shownWhileOpen;
}
