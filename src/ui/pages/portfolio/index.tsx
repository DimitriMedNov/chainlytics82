import { useState } from "react";
import { Plus } from "lucide-react";
import type { Position } from "@/domain/portfolio/types";
import { usePortfolioScreen } from "@/hooks/portfolio-screen/usePortfolioScreen";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { PageContainer, PageHeader, SaveStatus, StorageBadge, notify } from "@/ui/shared";
import { PortfolioContent } from "@/ui/pages/portfolio/PortfolioContent";
import { RegisterTransactionDialog } from "@/ui/pages/portfolio/transactions";

/**
 * Pantalla Portfolio (`/portfolio`). Contenedor: llama a `usePortfolioScreen()`
 * una sola vez y reparte datos y acciones por props. Guarda si el diálogo
 * «Registrar movimiento» está abierto porque tiene dos disparadores: el botón
 * de la cabecera y la acción del estado vacío.
 */
export default function PortfolioPage() {
  const screen = usePortfolioScreen();
  const [registerOpen, setRegisterOpen] = useState(false);
  const openRegister = () => setRegisterOpen(true);

  const handleSetCost = (position: Position, unitPrice: number) => {
    const notice = screen.setPositionCost(position, unitPrice);
    notify.info(notice.title, { description: notice.description });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Mi portfolio"
        description="Valorado a precio de mercado, con tu coste real de compra"
        actions={
          <Button
            type="button"
            className="min-h-11 w-full sm:w-auto"
            onClick={openRegister}
            disabled={!screen.canRegister}
          >
            <Plus aria-hidden="true" />
            Registrar movimiento
          </Button>
        }
      >
        <StorageBadge isSynced={screen.isSynced} />
        <SaveStatus
          isSaving={screen.isSaving}
          errorMessage={screen.saveErrorMessage}
          onDismissError={screen.clearSaveError}
        />
      </PageHeader>

      <PortfolioContent screen={screen} onRegister={openRegister} onSetCost={handleSetCost} />

      <RegisterTransactionDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        coins={screen.coins}
        onRegister={screen.registerTransaction}
      />
    </PageContainer>
  );
}
