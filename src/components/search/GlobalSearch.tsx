import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CoinSearchDialog } from "./CoinSearchDialog";
import CryptoDetailsModal from "@/components/CryptoDetailsModal";
import { useSearch } from "@/contexts/SearchContext";
import { findCoin, useCoinsByIds, useMarkets } from "@/hooks/useMarketData";
import type { CoinSearchResult } from "@/lib/coingecko";

/**
 * Buscador global: atajo de teclado, diálogo y, al elegir una moneda, su
 * ficha completa. Funciona con cualquier moneda del catálogo, no solo con
 * las que ya tenemos cargadas.
 */
export function GlobalSearch() {
  const { isOpen, setOpen } = useSearch();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Si la moneda ya está en el top cargado, no gastamos otra petición.
  const { data: markets } = useMarkets();
  const yaCargada = selectedId === null ? undefined : findCoin(markets, selectedId);

  const { data, isError, error } = useCoinsByIds(
    selectedId === null || yaCargada ? [] : [selectedId],
  );
  const coin = yaCargada ?? data?.[0] ?? null;

  useEffect(() => {
    if (isError && selectedId !== null) {
      toast.error("No se pudo cargar esa moneda", { description: error.message });
      setSelectedId(null);
      setModalOpen(false);
    }
  }, [isError, error, selectedId]);

  const handleSelect = (result: CoinSearchResult) => {
    setSelectedId(result.id);
    setOpen(false);
    setModalOpen(true);
  };

  return (
    <>
      <CoinSearchDialog open={isOpen} onOpenChange={setOpen} onSelect={handleSelect} />
      <CryptoDetailsModal
        open={modalOpen && coin !== null}
        onOpenChange={(next) => {
          setModalOpen(next);
          if (!next) setSelectedId(null);
        }}
        coin={coin}
      />
    </>
  );
}

export default GlobalSearch;
