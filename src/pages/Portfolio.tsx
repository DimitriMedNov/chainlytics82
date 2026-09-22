import { useMemo } from "react";
import { Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AddTransactionDialog from "@/components/portfolio/AddTransactionDialog";
import PortfolioDistribution from "@/components/portfolio/PortfolioDistribution";
import PortfolioSummaryCards from "@/components/portfolio/PortfolioSummaryCards";
import PositionsCard from "@/components/portfolio/PositionsCard";
import TransactionsCard from "@/components/portfolio/TransactionsCard";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { StorageBadge } from "@/components/states/StorageBadge";
import { useToast } from "@/hooks/use-toast";
import { useMarkets } from "@/hooks/useMarketData";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useChartColors } from "@/hooks/useChartColors";
import { buildPositions, summarize } from "@/lib/portfolioMath";

const Portfolio = () => {
  const { toast } = useToast();
  const { series: chartColors } = useChartColors();
  const portfolio = usePortfolio();
  const { transactions, addTransaction, removeTransaction, setMissingCost } = portfolio;
  const { data, isPending, isError, error, refetch, isFetching } = useMarkets();

  const positions = useMemo(() => buildPositions(transactions, data), [transactions, data]);
  const totals = useMemo(() => summarize(positions, transactions), [positions, transactions]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Mi portfolio</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Valorado a precio de mercado, con tu coste real de compra
          </p>
          <div className="mt-2">
            <StorageBadge isSynced={portfolio.isSynced} />
          </div>
        </div>
        <AddTransactionDialog
          coins={data ?? []}
          onAdd={addTransaction}
          disabled={isPending || isError}
        />
      </header>

      {portfolio.isError ? (
        <ErrorState
          title="No se pudieron cargar tus movimientos"
          message={portfolio.errorMessage}
          onRetry={portfolio.refetch}
          isRetrying={portfolio.isRefetching}
        />
      ) : isError ? (
        <ErrorState
          title="No se pudieron cargar los precios"
          message={error.message}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      ) : isPending || portfolio.isPending ? (
        <div className="space-y-6" aria-busy="true">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {["valor", "invertido", "ganancia", "posiciones"].map((key) => (
              <Skeleton key={key} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-[320px] w-full" />
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Tu portfolio está vacío"
          description="Registra tus compras con el precio que pagaste y verás tu ganancia real, no solo cuánto valen hoy."
          action={<AddTransactionDialog coins={data} onAdd={addTransaction} />}
        />
      ) : (
        <>
          <PortfolioSummaryCards totals={totals} />

          {positions.length > 0 && (
            <>
              <PortfolioDistribution
                positions={positions}
                totalValue={totals.value}
                colors={chartColors}
              />
              <PositionsCard
                positions={positions}
                onSetCost={(position, unitPrice) => {
                  setMissingCost(position.coinId, unitPrice);
                  toast({
                    title: "Coste registrado",
                    description: `Ya podemos calcular la ganancia de ${position.name}.`,
                  });
                }}
              />
            </>
          )}

          <TransactionsCard
            transactions={transactions}
            onRemove={(id) => {
              removeTransaction(id);
              toast({
                title: "Movimiento borrado",
                description: "Las posiciones se han recalculado.",
              });
            }}
          />
        </>
      )}
    </div>
  );
};

export default Portfolio;
