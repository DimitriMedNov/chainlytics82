import { RefreshCw, TriangleAlert } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { SHARED_TEXTS } from "@/application/shared/presentation/texts";
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
      /**
       * Bloque en móvil y franja desde `lg` (1024 px). Para huecos bajos de
       * escritorio: desde `lg` mide 62 px con una línea de detalle (botón de 44 px).
       */
      responsive:
        "flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-10 text-center lg:flex-row lg:flex-wrap lg:gap-x-3 lg:gap-y-2 lg:rounded-md lg:px-3 lg:py-2 lg:text-left",
    },
  },
  defaultVariants: { layout: "block" },
});

type ErrorLayout = NonNullable<VariantProps<typeof errorStateVariants>["layout"]>;

interface ErrorPartClasses {
  badge: string;
  icon: string;
  text: string;
  heading: string;
  button: string;
}

/** Clases de cada parte según la forma (las de `responsive` son las de `block` hasta `lg`). */
const PART_CLASSES: Record<ErrorLayout, ErrorPartClasses> = {
  block: { badge: "size-11 bg-destructive/12", icon: "size-5", text: "", heading: "type-section text-balance", button: "mt-1" },
  inline: { badge: "size-5", icon: "size-4", text: "flex-1", heading: "", button: "" },
  responsive: {
    badge: "size-11 bg-destructive/12 lg:size-5 lg:bg-transparent",
    icon: "size-5 lg:size-4",
    text: "lg:flex-1",
    heading: "max-lg:type-section max-lg:text-balance",
    button: "mt-1 lg:mt-0",
  },
};

export const DEFAULT_ERROR_TITLE = SHARED_TEXTS.error.defaultTitle;

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
  retryLabel = SHARED_TEXTS.error.retry,
  headingLevel: Heading = "p",
  layout,
  className,
}: ErrorStateProps) {
  const detail = message ?? messageOf(error);
  const parts = PART_CLASSES[layout ?? "block"];

  return (
    <div role="alert" data-slot="error-state" className={cn(errorStateVariants({ layout }), className)}>
      <span
        className={cn("flex shrink-0 items-center justify-center rounded-full text-destructive", parts.badge)}
      >
        <TriangleAlert className={parts.icon} aria-hidden="true" />
      </span>
      <div className={cn("flex min-w-0 flex-col gap-1", parts.text)}>
        <Heading className={cn("font-semibold text-foreground", parts.heading)}>{title}</Heading>
        {detail ? <p className="max-w-md text-pretty text-muted-foreground">{detail}</p> : null}
      </div>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          className={cn("min-h-11", parts.button)}
          onClick={onRetry}
          disabled={isRetrying}
        >
          <RefreshCw className={cn(isRetrying && "animate-spin motion-reduce:animate-none")} aria-hidden="true" />
          {isRetrying ? SHARED_TEXTS.error.retrying : retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { errorStateVariants };
