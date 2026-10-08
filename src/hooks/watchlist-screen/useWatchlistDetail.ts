import { useCallback, useState } from "react";
import type { Coin } from "@/domain/market/coin";

/** Qué moneda está abierta en el modal de detalle, y si el modal está abierto. */
// Conservado: la moneda es una copia tomada al abrir, así que su precio no se
// refresca mientras el modal está abierto; al cerrar se conserva la última
// moneda (inventario §9, punto 26).
export function useWatchlistDetail() {
  const [coin, setCoin] = useState<Coin | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((item: Coin) => {
    setCoin(item);
    setIsOpen(true);
  }, []);

  return {
    coin,
    isOpen,
    open,
    /** Para `onOpenChange` del modal. */
    setOpen: setIsOpen,
  };
}
