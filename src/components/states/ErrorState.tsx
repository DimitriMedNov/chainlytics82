import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  /** Qué falló, en palabras que el usuario entienda. */
  message: string;
  title?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

/** Estado de error: dice qué pasó y ofrece reintentar. */
export function ErrorState({
  message,
  title = "No se pudieron cargar los datos",
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 px-4 py-10 text-center",
        className,
      )}
    >
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-1 min-h-11 gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRetrying && "animate-spin")} aria-hidden="true" />
          {isRetrying ? "Reintentando…" : "Reintentar"}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
