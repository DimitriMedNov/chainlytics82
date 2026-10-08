import { motion } from "motion/react";
import { formatPriceRange } from "@/application/compare/presentation/labels";
import type { RankingEntry } from "@/domain/compare/charts";
import { cn } from "@/lib/utils";
import { CoinAvatar, PriceChange } from "@/ui/shared";
import { ENTER, REORDER } from "@/ui/pages/compare/motion";
import { SeriesDot } from "@/ui/pages/compare/series-dot";
import { useAnimatedNumber } from "@/ui/pages/compare/use-animated-number";

export interface RankingRowProps {
  entry: RankingEntry;
  className?: string;
}

/**
 * Un puesto de la clasificación. Si al cambiar de periodo cambia de puesto, se desliza
 * hasta el nuevo (`layout="position"`: solo `transform`) y su variación recorre la
 * distancia hasta la cifra nueva, para que se vea quién adelanta a quién.
 */
export function RankingRow({ entry, className }: RankingRowProps) {
  const changePct = useAnimatedNumber(entry.changePct);

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...ENTER, layout: REORDER }}
      data-slot="ranking-row"
      className={cn(className)}
    >
      <span className="type-num w-5 shrink-0 text-sm font-semibold text-muted-foreground">
        {entry.position}.
      </span>
      <SeriesDot colorIndex={entry.colorIndex} size="md" />
      {entry.image ? <CoinAvatar src={entry.image} symbol={entry.symbol} /> : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{entry.name}</p>
        <p className="type-num text-xs text-muted-foreground">
          {formatPriceRange(entry.firstPrice, entry.lastPrice)}
        </p>
      </div>
      {/* `PriceChange` ya pinta la bajada en naranja (aviso), nunca en rojo. */}
      <PriceChange value={changePct} size="md" className="shrink-0 font-semibold" />
    </motion.li>
  );
}
