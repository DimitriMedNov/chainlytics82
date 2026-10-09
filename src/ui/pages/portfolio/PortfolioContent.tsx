import { Plus, Wallet } from "lucide-react";
import {
  EMPTY_DESCRIPTION,
  EMPTY_TITLE,
  PRICES_ERROR_TITLE,
  REGISTER_TRANSACTION_LABEL,
  TRANSACTIONS_ERROR_TITLE,
} from "@/application/portfolio-screen/messages";
import type { Position } from "@/domain/portfolio/types";
import type { PortfolioScreen } from "@/hooks/portfolio-screen/usePortfolioScreen";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { Fade } from "@/ui/animate-ui/primitives/effects/fade";
import { EmptyState, ErrorState, PageGrid } from "@/ui/shared";
import { DistributionSection } from "@/ui/pages/portfolio/DistributionSection";
import { QUICK } from "@/ui/pages/portfolio/motion";
import { PortfolioSkeleton } from "@/ui/pages/portfolio/PortfolioSkeleton";
import { PositionsPanel } from "@/ui/pages/portfolio/PositionsPanel";
import { SummaryCards } from "@/ui/pages/portfolio/SummaryCards";
import { TransactionsPanel } from "@/ui/pages/portfolio/transactions";

export interface PortfolioContentProps {
  /** Lo que devuelve `usePortfolioScreen()`, llamado una sola vez en la página. */
  screen: PortfolioScreen;
  /** Abre el diálogo «Registrar movimiento» (acción del estado vacío). */
  onRegister: () => void;
  /** Fija el coste de una posición y lanza su aviso. */
  onSetCost: (position: Position, unitPrice: number) => void;
}

/**
 * El cuerpo de la pantalla según `screen.state`: error, cargando, vacío o listo.
 * Paso entre estados: el esqueleto sale de golpe (nada se solapa ni salta) y lo
 * que llega entra animado: error y vacío con un fundido (`Fade` de Animate UI);
 * en «listo», cada sección trae su propia entrada (tarjetas, gráficas, filas).
 */
export function PortfolioContent({ screen, onRegister, onSetCost }: PortfolioContentProps) {
  if (screen.state === "transactions-error" || screen.state === "prices-error") {
    return (
      <Fade transition={QUICK}>
        <ErrorState
          title={screen.state === "transactions-error" ? TRANSACTIONS_ERROR_TITLE : PRICES_ERROR_TITLE}
          message={screen.errorMessage}
          onRetry={screen.retry}
          isRetrying={screen.isRetrying}
        />
      </Fade>
    );
  }

  if (screen.state === "loading") return <PortfolioSkeleton />;

  if (screen.state === "empty") {
    return (
      <Fade transition={QUICK}>
        <EmptyState
          icon={Wallet}
          title={EMPTY_TITLE}
          description={EMPTY_DESCRIPTION}
          action={
            <Button type="button" className="min-h-11" onClick={onRegister}>
              <Plus aria-hidden="true" />
              {REGISTER_TRANSACTION_LABEL}
            </Button>
          }
        />
      </Fade>
    );
  }

  const transactions = (
    <TransactionsPanel
      rows={screen.rows}
      count={screen.transactions.length}
      onRemove={screen.removeTransaction}
    />
  );

  if (!screen.hasPositions) {
    return (
      <>
        <SummaryCards figures={screen.figures} />
        {transactions}
      </>
    );
  }

  return (
    <>
      <SummaryCards figures={screen.figures} />
      <DistributionSection distribution={screen.distribution} gains={screen.gains} />
      <PageGrid layout="main" className="items-start">
        <PositionsPanel positions={screen.positions} onSetCost={onSetCost} />
        {transactions}
      </PageGrid>
    </>
  );
}
