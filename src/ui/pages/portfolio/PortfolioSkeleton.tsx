import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ListSkeleton, LoadingRegion, Skeleton, StatSkeleton, statGridVariants } from "@/ui/shared";

const STATS = ["valor", "invertido", "papel", "realizada"] as const;
const BLOCKS = ["distribucion", "peso", "ganancia"] as const;

function PanelSkeleton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-4 rounded-lg border bg-card p-4 shadow-card sm:p-5", className)}>
      <Skeleton className="h-5 w-40 max-w-full" />
      {children}
    </div>
  );
}

/**
 * Carga de la pantalla con la forma real: 4 tarjetas, los 3 bloques de la
 * distribución y las dos listas (posiciones y movimientos).
 */
export function PortfolioSkeleton() {
  return (
    <LoadingRegion label="Cargando tu portfolio">
      <div className="flex flex-col gap-6">
        <div className={statGridVariants({ columns: 4 })}>
          {STATS.map((key) => (
            <StatSkeleton key={key} size="lg" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {BLOCKS.map((key) => (
            <PanelSkeleton key={key} className={key === "ganancia" ? "lg:col-span-2 xl:col-span-1" : undefined}>
              <Skeleton className="h-64 w-full rounded-md" />
            </PanelSkeleton>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <PanelSkeleton className="px-0 sm:px-0 lg:col-span-2 [&>:first-child]:mx-4 sm:[&>:first-child]:mx-5">
            <ListSkeleton rows={3} columns={2} />
          </PanelSkeleton>
          <PanelSkeleton className="px-0 sm:px-0 [&>:first-child]:mx-4 sm:[&>:first-child]:mx-5">
            <ListSkeleton rows={3} columns={1} />
          </PanelSkeleton>
        </div>
      </div>
    </LoadingRegion>
  );
}
