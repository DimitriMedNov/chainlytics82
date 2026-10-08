import { useCallback, useState } from "react";
import type { Coin } from "@/domain/market/coin";

export interface UseCoinDetailSelectionResult {
  /** Última moneda elegida. Se conserva al cerrar, para la animación de salida. */
  selectedCoin: Coin | null;
  isOpen: boolean;
  openDetails: (coin: Coin) => void;
  /** Para el `onOpenChange` del modal. */
  setOpen: (open: boolean) => void;
}

/** Qué moneda enseña el modal de detalle abierto desde "Ver detalles". */
export function useCoinDetailSelection(): UseCoinDetailSelectionResult {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [isOpen, setOpen] = useState(false);

  const openDetails = useCallback((coin: Coin) => {
    setSelectedCoin(coin);
    setOpen(true);
  }, []);

  return { selectedCoin, isOpen, openDetails, setOpen };
}
