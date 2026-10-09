import { cn } from "@/lib/utils";
import { Skeleton } from "@/ui/shared";

const BARS = [
  { id: "a", width: "w-10/12" },
  { id: "b", width: "w-7/12" },
  { id: "c", width: "w-11/12" },
  { id: "d", width: "w-5/12" },
  { id: "e", width: "w-8/12" },
  { id: "f", width: "w-4/12" },
  { id: "g", width: "w-9/12" },
  { id: "h", width: "w-6/12" },
  { id: "i", width: "w-3/12" },
  { id: "j", width: "w-7/12" },
] as const;
const LEGEND = ["a", "b", "c"] as const;

/** Con la forma de las barras: símbolo, barra y valor; mismo alto (`h-72`) que la gráfica. */
export function ChangeBarsSkeleton() {
  return (
    <div data-slot="markets-change-bars-skeleton" className="flex h-72 flex-col justify-between py-1">
      {BARS.map(({ id, width }) => (
        <div key={id} className="flex items-center gap-2">
          <Skeleton className="h-3 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <Skeleton className={cn("h-4 rounded-sm", width)} />
          </div>
          <Skeleton className="h-3 w-14 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/** Con la forma del anillo y su leyenda de 3 líneas. */
export function TrendRingSkeleton() {
  return (
    <div data-slot="markets-trend-ring-skeleton" className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col">
      <Skeleton className="aspect-square h-48 max-w-full shrink-0 rounded-full" />
      <div className="flex w-full min-w-0 flex-col gap-2">
        {LEGEND.map((line) => (
          <div key={line} className="flex items-center justify-between gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
