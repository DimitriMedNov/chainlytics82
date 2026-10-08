import { Construction } from "lucide-react";
import { Link } from "react-router-dom";
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
        title="Pantalla en construcción"
        description={
          <>
            Esta pantalla del rediseño todavía no está escrita. Sustituye{" "}
            <code className="font-mono text-xs text-foreground">{file}</code>.
          </>
        }
        action={
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/">Volver al panel</Link>
          </Button>
        }
      />
    </PageContainer>
  );
}
