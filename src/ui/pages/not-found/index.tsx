import { Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { EmptyState } from "@/ui/shared/empty-state";
import { PageContainer } from "@/ui/shared/page";

/** Pantalla 404: cualquier dirección que no sea una de las 7 rutas. */
export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <PageContainer width="narrow" className="py-12 lg:py-20">
      <EmptyState
        icon={Compass}
        headingLevel="h1"
        title="Esta página no existe"
        description={
          <>
            No hay nada en{" "}
            <code className="break-all font-mono text-xs text-foreground">{pathname}</code>. Puede
            que el enlace esté mal escrito o que la página se haya movido.
          </>
        }
        action={
          <>
            <Button asChild className="min-h-11">
              <Link to="/">Volver al panel</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <Link to="/markets">Ver mercados</Link>
            </Button>
          </>
        }
      />
    </PageContainer>
  );
}
