import { RefreshCw, TriangleAlert } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";

const errorStateVariants = cva("flex text-sm", {
  variants: {
    layout: {
      /** Ocupa la sección: icono arriba, centrado. */
      block: "flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-10 text-center",
      /** Una franja dentro de una tarjeta o encima de un formulario. */
      inline:
        "flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2",
    },
  },
  defaultVariants: { layout: "block" },
});

export const DEFAULT_ERROR_TITLE = "No se pudieron cargar los datos";

export interface ErrorStateProps extends VariantProps<typeof errorStateVariants> {
  /** Qué falló, en una línea. */
  title?: string;
  /** Detalle. Si no se pasa, se usa `error.message`. */
  message?: string;
  /** El error tal cual llega de react-query (`query.error`): se enseña su `message`. */
  error?: unknown;
  /** Reintento (`query.refetch`). Sin él no hay botón: pásalo siempre que exista. */
  onRetry?: () => void;
  /** `query.isFetching` / `isRefetching`: deshabilita el botón y cambia su texto. */
  isRetrying?: boolean;
  retryLabel?: string;
  /**
   * Etiqueta del título. Por defecto `p` (un error dentro de un bloque no añade
   * encabezados). `h1` solo cuando el error ES la pantalla (límite de errores de ruta).
   */
  headingLevel?: "p" | "h1" | "h2" | "h3" | "h4";
  className?: string;
}

function messageOf(error: unknown): string | undefined {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return undefined;
}

/** Estado de error: qué pasó + botón «Reintentar». */
export function ErrorState({
  title = DEFAULT_ERROR_TITLE,
  message,
  error,
  onRetry,
  isRetrying = false,
  retryLabel = "Reintentar",
  headingLevel: Heading = "p",
  layout,
  className,
}: ErrorStateProps) {
  const detail = message ?? messageOf(error);
  const inline = layout === "inline";

  return (
    <div role="alert" data-slot="error-state" className={cn(errorStateVariants({ layout }), className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full text-destructive",
          inline ? "size-5" : "size-11 bg-destructive/12",
        )}
      >
        <TriangleAlert className={cn(inline ? "size-4" : "size-5")} aria-hidden="true" />
      </span>
      <div className={cn("flex min-w-0 flex-col gap-1", inline && "flex-1")}>
        <Heading className={cn("font-semibold text-foreground", !inline && "type-section text-balance")}>{title}</Heading>
        {detail ? <p className="max-w-md text-pretty text-muted-foreground">{detail}</p> : null}
      </div>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          className={cn("min-h-11", !inline && "mt-1")}
          onClick={onRetry}
          disabled={isRetrying}
        >
          <RefreshCw className={cn(isRetrying && "animate-spin")} aria-hidden="true" />
          {isRetrying ? "Reintentando…" : retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { errorStateVariants };
