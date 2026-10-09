import { LoaderCircle, Search, SearchX } from "lucide-react";
import { SEARCH_CLEAR, SEARCH_RETRY, SEARCH_SEARCHING } from "@/application/search/messages";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { EmptyState, ErrorState, LoadingRegion, Skeleton } from "@/ui/shared";

/** Filas fijas del esqueleto: nunca se reordenan. */
const SKELETON_ROWS = ["w-28", "w-36", "w-24", "w-32", "w-20"] as const;

export interface SearchMessageProps {
  message: string;
}

/** Aún no hay dos letras: la salida es seguir escribiendo en la caja. */
export function SearchTooShort({ message }: SearchMessageProps) {
  return <EmptyState icon={Search} title={message} headingLevel="h3" size="sm" framed={false} />;
}

/** Cargando: filas con la forma de un resultado + «Buscando…». */
export function SearchLoading() {
  return (
    <LoadingRegion label={SEARCH_SEARCHING} data-slot="search-loading" className="p-1">
      <p className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground">
        <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
        {SEARCH_SEARCHING}
      </p>
      {SKELETON_ROWS.map((width) => (
        <div key={width} className="flex min-h-11 items-center gap-3 px-3 py-2">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <Skeleton className={cn("h-4 max-w-full", width)} />
          <Skeleton className="ml-auto h-3 w-10 shrink-0" />
          <Skeleton className="h-3 w-8 shrink-0" />
        </div>
      ))}
    </LoadingRegion>
  );
}

export interface SearchEmptyProps extends SearchMessageProps {
  onClear: () => void;
}

/** Sin coincidencias: mensaje + borrar lo escrito para probar otra cosa. */
export function SearchEmpty({ message, onClear }: SearchEmptyProps) {
  return (
    <EmptyState
      icon={SearchX}
      title={message}
      headingLevel="h3"
      size="sm"
      framed={false}
      action={
        <Button type="button" variant="outline" className="min-h-11" onClick={onClear}>
          {SEARCH_CLEAR}
        </Button>
      }
    />
  );
}

export interface SearchErrorProps extends SearchMessageProps {
  onRetry: () => void;
  isRetrying: boolean;
}

/** Falló la búsqueda: el mensaje del error + «Reintentar». */
export function SearchError({ message, onRetry, isRetrying }: SearchErrorProps) {
  return (
    <ErrorState
      title={message}
      onRetry={onRetry}
      isRetrying={isRetrying}
      retryLabel={SEARCH_RETRY}
      className="m-2 px-4 py-6"
    />
  );
}
