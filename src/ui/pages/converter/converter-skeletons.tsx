import { Skeleton } from "@/ui/shared";

const ROWS = [0, 1, 2, 3] as const;

export interface FieldSkeletonProps {
  /** Alto de la línea de ayuda bajo el control, la del campo real: sin ella, una línea o dos. */
  hint: "none" | "line" | "two-lines";
}

/** Con la forma de un campo: etiqueta, control de 44 px y su línea de ayuda. */
function FieldSkeleton({ hint }: FieldSkeletonProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-11 w-full rounded-md" />
      {hint === "none" ? null : (
        <div className={hint === "line" ? "h-4" : "h-8"}>
          <Skeleton className="h-4 w-32 max-w-full" />
        </div>
      )}
    </div>
  );
}

export interface BlockSkeletonProps {
  /** Ayuda del primer campo: «Cantidad» no lleva; «Resultado» reserva dos líneas. */
  firstHint: FieldSkeletonProps["hint"];
}

function BlockSkeleton({ firstHint }: BlockSkeletonProps) {
  return (
    <div className="grid gap-4 rounded-lg bg-elevated p-4 sm:grid-cols-2 sm:p-5">
      <FieldSkeleton hint={firstHint} />
      <FieldSkeleton hint="line" />
    </div>
  );
}

/**
 * Con la forma del formulario y su mismo alto en cada ancho: dos bloques de dos campos, el botón
 * redondo entre ellos y la línea resumen.
 */
export function ConverterFormSkeleton() {
  return (
    <div className="flex flex-col">
      <BlockSkeleton firstHint="none" />
      <div className="relative z-10 -my-3 flex justify-center">
        <Skeleton className="size-11 rounded-full" />
      </div>
      <BlockSkeleton firstHint="two-lines" />
      <Skeleton className="mx-auto mt-4 h-5 w-56 max-w-full" />
    </div>
  );
}

/** Con la forma de «Conversiones rápidas»: cantidad + leyenda a la izquierda, valor a la derecha. */
export function QuickListSkeleton() {
  return (
    <div className="divide-y">
      {ROWS.map((row) => (
        <div key={row} className="flex min-h-14 items-center justify-between gap-3 px-4 py-2 sm:px-5">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-28 max-w-full" />
          </div>
          <Skeleton className="h-4 w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/** Con la forma de la gráfica de barras: código, barra y valor en cada fila. Mismo alto (`h-32`). */
export function RateBarsSkeleton() {
  return (
    <div className="flex h-32 flex-col justify-around">
      {ROWS.map((row) => (
        <div key={row} className="flex items-center gap-2">
          <Skeleton className="h-3 w-9 shrink-0" />
          <Skeleton className="h-4 flex-1 rounded-sm" />
          <Skeleton className="h-3 w-14 shrink-0" />
        </div>
      ))}
    </div>
  );
}
