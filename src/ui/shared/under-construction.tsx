import { Construction } from "lucide-react";
import { Link } from "react-router-dom";
import { SHARED_TEXTS } from "@/application/shared/presentation/texts";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { EmptyState } from "@/ui/shared/empty-state";
import { PageContainer, PageHeader } from "@/ui/shared/page";

export interface UnderConstructionProps {
  /** Título de la pantalla (`h1`). */
  title: string;
  description?: string;
  /** Archivo que sustituirá el agente de la pantalla. */
  file: string;
}

/** Marcador de una pantalla que aún no está escrita. Lo usa solo el armazón. */
export function UnderConstruction({ title, description, file }: UnderConstructionProps) {
  return (
    <PageContainer>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={Construction}
        title={SHARED_TEXTS.underConstruction.title}
        description={
          <>
            {SHARED_TEXTS.underConstruction.descriptionBeforeFile}
            <code className="font-mono text-xs text-foreground">{file}</code>
            {SHARED_TEXTS.underConstruction.descriptionAfterFile}
          </>
        }
        action={
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/">{SHARED_TEXTS.underConstruction.backToPanel}</Link>
          </Button>
        }
      />
    </PageContainer>
  );
}
