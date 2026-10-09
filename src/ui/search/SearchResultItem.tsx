import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { rankLabel } from "@/application/search/messages";
import type { CoinSearchResult } from "@/domain/market/coin";
import { CommandItem } from "@/ui/base/command";
import { useRowEntrance } from "@/ui/search/useSearchMotion";
import { CoinAvatar } from "@/ui/shared";

export interface SearchResultItemProps {
  result: CoinSearchResult;
  /** Puesto en la lista: escalona la entrada. */
  index: number;
  onSelect: (result: CoinSearchResult) => void;
}

/** Una moneda de la lista: miniatura de 24 px, nombre, símbolo y puesto si lo tiene. */
export function SearchResultItem({ result, index, onSelect }: SearchResultItemProps) {
  const rank = rankLabel(result.rank);
  const entrance = useRowEntrance(index);

  return (
    <CommandItem
      // Mismo valor que en la interfaz anterior: nombre, símbolo e id.
      value={`${result.name} ${result.symbol} ${result.id}`}
      onSelect={() => onSelect(result)}
      data-slot="search-result"
      // El fondo de la fila seleccionada lo pone el resalte deslizante de la lista.
      className="min-h-11 cursor-pointer rounded-md px-3 py-2 data-[selected=true]:bg-transparent"
    >
      {/* Entra el contenido, no la fila: cmdk sigue midiendo y marcando la fila tal cual. */}
      <motion.span
        className="flex min-w-0 flex-1 items-center gap-3"
        initial={entrance.initial}
        animate={entrance.animate}
      >
        {result.thumb ? (
          <CoinAvatar src={result.thumb} symbol={result.symbol} size="sm" priority />
        ) : (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
            <TrendingUp className="size-4" aria-hidden="true" />
          </span>
        )}
        <span className="min-w-0 flex-1 truncate font-medium text-foreground">{result.name}</span>
        <span className="max-w-24 shrink-0 truncate text-xs uppercase text-muted-foreground">
          {result.symbol}
        </span>
        {rank ? <span className="type-num shrink-0 text-xs text-muted-foreground">{rank}</span> : null}
      </motion.span>
    </CommandItem>
  );
}
