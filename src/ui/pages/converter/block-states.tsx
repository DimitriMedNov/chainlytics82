import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { ConverterBlock } from "@/hooks/converter/useConverter";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { EmptyState, ErrorState, LoadingRegion } from "@/ui/shared";

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
  emptyIcon: LucideIcon;
  /** Esqueleto con la forma del contenido real. */
  skeleton: ReactNode;
  /** El contenido cuando hay filas. */
  children: ReactNode;
}

/** Los 4 estados de un bloque lateral: error con reintentar, cargando, vacío con acción y éxito. */
export function BlockStates({ block, texts, emptyIcon, skeleton, children }: BlockStatesProps) {
  if (block.status === "error") {
    return (
      <div className="p-4 sm:p-5">
        <ErrorState
          title={texts.errorTitle}
          message={block.errorMessage}
          onRetry={block.refetch}
          isRetrying={block.isRetrying}
        />
      </div>
    );
  }
  if (block.status === "loading") return <LoadingRegion label={texts.loading}>{skeleton}</LoadingRegion>;
  if (block.status === "empty") {
    return (
      <EmptyState
        icon={emptyIcon}
        size="sm"
        framed={false}
        headingLevel="h3"
        title={texts.emptyTitle}
        description={texts.emptyDescription}
        action={
          <Button type="button" variant="outline" className="min-h-11" onClick={block.refetch}>
            {texts.emptyAction}
          </Button>
        }
      />
    );
  }
  return <>{children}</>;
}
