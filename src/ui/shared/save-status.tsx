import { LoaderCircle, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SaveStatusProps {
  /** `isSaving` del hook (watchlist, portfolio). */
  isSaving: boolean;
  /** `saveErrorMessage` del hook: "" si no hay error. */
  errorMessage?: string;
  /** `clearSaveError` del hook: pinta el botón para descartar el error. */
  onDismissError?: () => void;
  className?: string;
}

/**
 * Indicador de guardado: «Guardando…» mientras dura y, si falló, el error con
 * su botón para descartarlo. Sin nada que decir no pinta nada, pero la región
 * `aria-live` sigue en el DOM para que el cambio se anuncie.
 */
export function SaveStatus({ isSaving, errorMessage = "", onDismissError, className }: SaveStatusProps) {
  const hasError = errorMessage !== "";

  return (
    <div data-slot="save-status" className={cn("flex min-w-0 items-center text-xs", className)}>
      <span role="status" aria-live="polite" className="inline-flex items-center gap-1.5 text-muted-foreground">
        {isSaving ? (
          <>
            <LoaderCircle className="size-3.5 shrink-0 animate-spin" aria-hidden="true" />
            Guardando…
          </>
        ) : null}
      </span>
      {hasError && !isSaving ? (
        <span role="alert" className="inline-flex min-w-0 items-center gap-1.5 text-destructive">
          <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 text-pretty">No se pudo guardar: {errorMessage}</span>
          {onDismissError ? (
            <button
              type="button"
              onClick={onDismissError}
              aria-label="Descartar el aviso de error"
              className="-my-3 inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
