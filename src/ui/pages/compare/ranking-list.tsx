import { motion } from "motion/react";
import type { RankingEntry } from "@/domain/compare/charts";
import { Skeleton } from "@/ui/shared";
import { RankingRow } from "@/ui/pages/compare/ranking-row";

export interface RankingListProps {
  /** De mejor a peor. */
  entries: RankingEntry[];
  /** Id del título que nombra la lista. */
  labelledBy: string;
}

const ROW = "flex min-h-14 items-center gap-3 px-4 py-3 sm:px-5";

/**
 * Clasificación: puesto, color de su línea, logo, nombre, precio inicial → final y variación.
 * `layoutRoot`: las filas miden su sitio respecto a la lista, así que solo se deslizan
 * cuando cambian de puesto, no cuando la lista entera se mueve porque cambió algo de arriba.
 */
export function RankingList({ entries, labelledBy }: RankingListProps) {
  return (
    <motion.ol
      layoutRoot
      aria-labelledby={labelledBy}
      data-slot="ranking-list"
      className="divide-y border-t"
    >
      {entries.map((entry) => (
        <RankingRow key={entry.coinId} entry={entry} className={ROW} />
      ))}
    </motion.ol>
  );
}

export interface RankingListSkeletonProps {
  rows: number;
}

/** Con la forma de `RankingList`: puesto, punto, logo, dos líneas de texto y la variación. */
export function RankingListSkeleton({ rows }: RankingListSkeletonProps) {
  return (
    <div className="divide-y border-t">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className={ROW}>
          <Skeleton className="h-4 w-5 shrink-0" />
          <Skeleton className="size-3 shrink-0 rounded-full" />
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-24 max-w-full" />
            <Skeleton className="h-3 w-36 max-w-full" />
          </div>
          <Skeleton className="h-5 w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
}
