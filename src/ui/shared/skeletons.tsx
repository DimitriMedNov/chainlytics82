import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/ui/base/skeleton";

/** Cuántos elementos pintar: claves estables para una lista que nunca se reordena. */
function slots(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index);
}

export interface LoadingRegionProps extends ComponentProps<"div"> {
  /** Qué se está cargando, para lectores de pantalla: "Cargando mercados". */
  label?: string;
}

/** Envuelve cualquier esqueleto: lo anuncia como «cargando» y lo esconde del árbol accesible. */
export function LoadingRegion({ label = "Cargando", children, ...props }: LoadingRegionProps) {
  return (
    <div role="status" aria-busy="true" data-slot="loading" {...props}>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

export interface StatSkeletonProps {
  size?: "md" | "lg";
  className?: string;
}

/** Con la forma de `Stat`: etiqueta, cifra y variación. */
export function StatSkeleton({ size = "md", className }: StatSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 rounded-lg border bg-card p-4 shadow-card", className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className={cn("w-32", size === "lg" ? "h-8.5" : "h-6.5")} />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export interface RowSkeletonProps {
  /** Columnas de cifras a la derecha del nombre. */
  columns?: number;
  className?: string;
}

/** Con la forma de una fila de moneda: logo, nombre + símbolo y cifras a la derecha. */
export function RowSkeleton({ columns = 2, className }: RowSkeletonProps) {
  return (
    <div className={cn("flex min-h-14 items-center gap-3 px-4 py-2 sm:px-5", className)}>
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-28 max-w-full" />
        <Skeleton className="h-3 w-12" />
      </div>
      {slots(columns).map((column) => (
        <Skeleton key={column} className={cn("h-4 w-16 shrink-0", column > 0 && "hidden sm:block")} />
      ))}
    </div>
  );
}

export interface ListSkeletonProps extends RowSkeletonProps {
  rows?: number;
}

/** Varias `RowSkeleton` con divisores: tablas y listas. */
export function ListSkeleton({ rows = 5, columns, className }: ListSkeletonProps) {
  return (
    <div className={cn("divide-y", className)}>
      {slots(rows).map((row) => (
        <RowSkeleton key={row} columns={columns} />
      ))}
    </div>
  );
}

const CHART_HEIGHT = { sm: "h-40", md: "h-64", lg: "h-80" } as const;

export interface ChartSkeletonProps {
  height?: keyof typeof CHART_HEIGHT;
  className?: string;
}

/** Con la forma de una gráfica de serie temporal: área, eje Y y etiquetas del eje X. */
export function ChartSkeleton({ height = "md", className }: ChartSkeletonProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className={cn("flex gap-2", CHART_HEIGHT[height])}>
        <div className="flex flex-col justify-between py-1">
          {slots(4).map((tick) => (
            <Skeleton key={tick} className="h-3 w-8" />
          ))}
        </div>
        <Skeleton className="h-full flex-1 rounded-md" />
      </div>
      <div className="flex justify-between pl-10">
        {slots(5).map((tick) => (
          <Skeleton key={tick} className={cn("h-3 w-10", tick % 2 === 1 && "hidden sm:block")} />
        ))}
      </div>
    </div>
  );
}

/** Con la forma de `PageHeader`: título y descripción. */
export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Skeleton className="h-8 w-48 max-w-full" />
      <Skeleton className="h-5 w-80 max-w-full" />
    </div>
  );
}

export { Skeleton };
