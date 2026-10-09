import { Skeleton } from "@/ui/shared";

const ROWS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

/** 8 filas con la forma de `MarketCoinRow`: círculo de 40 px, dos líneas y bloque a la derecha. */
export function MarketListSkeleton() {
  return (
    <div data-slot="market-list-skeleton" className="divide-y border-t">
      {ROWS.map((row) => (
        <div key={row} className="flex min-h-16 items-center gap-2 px-3 py-2 sm:gap-4 sm:px-5">
          <Skeleton className="hidden h-3 w-9 shrink-0 sm:block" />
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-28 max-w-full" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="hidden h-8 w-36 shrink-0 sm:block" />
          <Skeleton className="hidden h-8 w-36 shrink-0 lg:block" />
          <Skeleton className="size-11 shrink-0 rounded-md md:w-28" />
        </div>
      ))}
    </div>
  );
}
