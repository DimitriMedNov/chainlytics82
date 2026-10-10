import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { ConverterBlock } from "@/hooks/converter/useConverter";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { EmptyState, ErrorState, LoadingRegion } from "@/ui/shared";

/**
 * El error llena el hueco reservado, con su contenido centrado (forma `block`). Como el alto lo
 * pone el hueco, su relleno vertical baja a 16 px: es margen para un mensaje más largo.
 */
export const ERROR_FILL = "flex-1 justify-center py-4";
/**
 * El error en un hueco bajo (forma `inline`, la compacta): en una tarjeta estrecha va en columna,
 * centrado y con el texto en `text-xs`; desde 448 px de tarjeta (`@md`), en fila y en `text-sm`.
 */
const ERROR_FILL_COMPACT =
  "grid flex-1 content-center justify-items-center gap-y-1.5 text-center text-xs @md:flex @md:flex-nowrap @md:px-4 @md:text-left @md:text-sm";

export interface ReservedSlotProps {
  /** El esqueleto del bloque: no se ve, solo da al hueco el alto del contenido real. */
  sizer: ReactNode;
  /** Relleno alrededor del estado. */
  className?: string;
  /** El estado (error o vacío) que ocupa el hueco. */
  children: ReactNode;
}

/**
 * Hueco con el alto del contenido real: el esqueleto, invisible, y el estado comparten la misma
 * celda de la rejilla. Así error y vacío miden lo mismo que cargando y éxito en cualquier ancho,
 * y al cambiar de estado no se mueve nada de lo que hay debajo.
 */
export function ReservedSlot({ sizer, className, children }: ReservedSlotProps) {
  return (
    <div data-slot="converter-reserved" className="grid min-w-0">
      <div aria-hidden="true" className="invisible col-start-1 row-start-1 min-w-0">
        {sizer}
      </div>
      <div className={cn("@container col-start-1 row-start-1 flex min-w-0 flex-col", className)}>{children}</div>
    </div>
  );
}

export interface BlockTexts {
  loading: string;
  errorTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
}

export interface BlockStatesProps {
  block: Pick<ConverterBlock<unknown>, "status" | "errorMessage" | "isRetrying" | "refetch">;
  texts: BlockTexts;
  /** Icono del vacío; el bloque `compact` no lo pinta (no cabe con holgura). */
  emptyIcon: LucideIcon;
  /** Esqueleto con la forma del contenido real. */
  skeleton: ReactNode;
  /** Bloque bajo (una lista corta): error y vacío en su forma compacta para caber en el hueco. */
  compact?: boolean;
  /** El contenido cuando hay filas. */
  children: ReactNode;
}

/** Los 4 estados de un bloque lateral, todos con el mismo alto: error, cargando, vacío y éxito. */
export function BlockStates({ block, texts, emptyIcon, skeleton, compact = false, children }: BlockStatesProps) {
  if (block.status === "error") {
    return (
      // El cuerpo `flush` ya deja 12 px arriba: el resto del relleno iguala los cuatro lados.
      <ReservedSlot sizer={skeleton} className={compact ? "px-3 pb-3" : "px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2"}>
        <ErrorState
          layout={compact ? "inline" : "block"}
          className={compact ? ERROR_FILL_COMPACT : ERROR_FILL}
          title={texts.errorTitle}
          message={block.errorMessage}
          onRetry={block.refetch}
          isRetrying={block.isRetrying}
        />
      </ReservedSlot>
    );
  }
  if (block.status === "loading") return <LoadingRegion label={texts.loading}>{skeleton}</LoadingRegion>;
  if (block.status === "empty") {
    return (
      <ReservedSlot sizer={skeleton}>
        <EmptyState
          icon={compact ? undefined : emptyIcon}
          size="sm"
          framed={false}
          headingLevel="h3"
          className={cn("flex-1", compact && "gap-1.5 py-2")}
          title={texts.emptyTitle}
          description={texts.emptyDescription}
          action={
            <Button type="button" variant="outline" className="min-h-11" onClick={block.refetch}>
              {texts.emptyAction}
            </Button>
          }
        />
      </ReservedSlot>
    );
  }
  return <>{children}</>;
}
