import { useCallback, useEffect, useRef, useState } from "react";
import { coinLoadErrorNotice, type CoinLoadErrorNotice } from "@/application/search/messages";
import type { Coin } from "@/domain/market/coin";
import { idsToFetch, resolveSelectedCoin } from "@/domain/search/rules";
import { useCoinsByIds, useMarkets } from "@/hooks/market/useMarketData";

export interface SelectedCoin {
  /** La moneda elegida, lista para el detalle; null si no hay o aún se está pidiendo. */
  coin: Coin | null;
  /** true cuando el detalle debe estar abierto: hay elección y su moneda ya cargó. */
  isOpen: boolean;
  /** true entre elegir un resultado y tener su moneda (solo si no estaba en el top). */
  isLoading: boolean;
  /** Elige una moneda por id y pide abrir su detalle. */
  select: (coinId: string) => void;
  /** Para el `onOpenChange` del detalle: al cerrar, olvida la elección. */
  setOpen: (open: boolean) => void;
}

/**
 * La moneda elegida en el buscador, resuelta desde el top cargado o, si no
 * está, pedida por id. `onLoadError` recibe el aviso si esa petición falla.
 */
export function useSelectedCoin(onLoadError?: (notice: CoinLoadErrorNotice) => void): SelectedCoin {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wantsOpen, setWantsOpen] = useState(false);

  // Si la moneda ya está en el top cargado, no gastamos otra petición.
  const { data: markets } = useMarkets();
  const { data, isError, error } = useCoinsByIds(idsToFetch(markets, selectedId));
  const coin = resolveSelectedCoin(markets, selectedId, data);

  // El aviso siempre usa la última función recibida, sin repetirlo.
  const notify = useRef(onLoadError);
  useEffect(() => {
    notify.current = onLoadError;
  }, [onLoadError]);

  useEffect(() => {
    if (isError && selectedId !== null) {
      notify.current?.(coinLoadErrorNotice(error.message));
      setSelectedId(null);
      setWantsOpen(false);
    }
  }, [isError, error, selectedId]);

  const select = useCallback((coinId: string) => {
    setSelectedId(coinId);
    setWantsOpen(true);
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setWantsOpen(open);
    if (!open) setSelectedId(null);
  }, []);

  return {
    coin,
    // Conservado: el detalle no se abre hasta que la moneda está cargada.
    isOpen: wantsOpen && coin !== null,
    isLoading: wantsOpen && selectedId !== null && coin === null,
    select,
    setOpen,
  };
}
