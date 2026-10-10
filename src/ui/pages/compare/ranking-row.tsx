import { motion, useReducedMotion } from "motion/react";
import { formatPriceRange } from "@/application/compare/presentation/labels";
import type { RankingEntry } from "@/domain/compare/charts";
import { cn } from "@/lib/utils";
import { CoinAvatar } from "@/ui/shared";
import { ENTER, REORDER } from "@/ui/pages/compare/motion";
import { RankingChange } from "@/ui/pages/compare/ranking-change";
import { SeriesDot } from "@/ui/pages/compare/series-dot";

export interface RankingRowProps {
  entry: RankingEntry;
  className?: string;
}

/**
 * Un puesto de la clasificación. Si al cambiar de periodo cambia de puesto, se desliza
 * hasta el nuevo (`layout="position"`: solo `transform`) y su variación recorre la
 * distancia hasta la cifra nueva (`RankingChange`), para que se vea quién adelanta a quién.
 * Con «reducir movimiento» no recibe `layout`: cambia de puesto sin `transform`.
 * Esta fila NO debe volver a pintarse en cada fotograma (ver `RankingChange`): solo cuando
 * cambian sus datos.
 */
export function RankingRow({ entry, className }: RankingRowProps) {
  const reduced = useReducedMotion();

  return (
    <motion.li
      layout={reduced ? undefined : "position"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reduced ? ENTER : { ...ENTER, layout: REORDER }}
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
      <RankingChange value={entry.changePct} />
    </motion.li>
  );
}
