import { useEffect, useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCoinSearch } from "@/hooks/useMarketData";
import { useDebounced } from "@/hooks/useDebounced";
import type { CoinSearchResult } from "@/lib/coingecko";

export interface CoinSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (coin: CoinSearchResult) => void;
}

/** Buscador de monedas sobre el catálogo completo, no solo el top cargado. */
export function CoinSearchDialog({ open, onOpenChange, onSelect }: CoinSearchDialogProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 300);
  const { data, isFetching, isError, error } = useCoinSearch(debouncedQuery);

  // Al cerrar, limpiamos para no reabrir con la búsqueda anterior.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const esperando = debouncedQuery.trim().length < 2;
  const sinResultados = !data || data.length === 0;

  const mensajeVacio = () => {
    if (esperando) return "Escribe al menos dos letras.";
    if (isFetching) return "Buscando…";
    if (isError) return error.message;
    return "Ninguna moneda con ese nombre.";
  };

  // shouldFilter=false: filtra el servidor, no queremos filtrar otra vez.
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
      <CommandInput
        placeholder="Busca cualquier criptomoneda…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {sinResultados && (
          <p className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            {isFetching && !esperando && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {mensajeVacio()}
          </p>
        )}

        {data && data.length > 0 && (
          <CommandGroup heading="Resultados">
            {data.map((coin) => (
              <CommandItem
                key={coin.id}
                value={`${coin.name} ${coin.symbol} ${coin.id}`}
                onSelect={() => onSelect(coin)}
                className="gap-3"
              >
                {coin.thumb ? (
                  <img
                    src={coin.thumb}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 flex-shrink-0 rounded-full"
                  />
                ) : (
                  <TrendingUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                )}
                <span className="flex-1 truncate">{coin.name}</span>
                <span className="text-xs text-muted-foreground">{coin.symbol}</span>
                {coin.rank !== null && (
                  <span className="text-xs text-muted-foreground">#{coin.rank}</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}


export default CoinSearchDialog;
