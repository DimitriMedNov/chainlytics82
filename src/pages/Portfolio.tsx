import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipProps } from "recharts";
import { HelpCircle, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AddTransactionDialog from "@/components/portfolio/AddTransactionDialog";
import SetCostDialog from "@/components/portfolio/SetCostDialog";
import TransactionsCard from "@/components/portfolio/TransactionsCard";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { StorageBadge } from "@/components/states/StorageBadge";
import { useToast } from "@/hooks/use-toast";
import { useMarkets } from "@/hooks/useMarketData";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useChartColors } from "@/hooks/useChartColors";
import { buildPositions, summarize } from "@/lib/portfolioMath";
import { formatAmount, formatCurrency, formatPercent, formatPercentShare } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Position } from "@/types/portfolio";

function SliceTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload as Position;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-lg">
      <p className="font-medium">{slice.name}</p>
      <p className="text-muted-foreground">{formatCurrency(slice.value)}</p>
    </div>
  );
}

/** Cifra con su signo y su color, o "—" cuando el dato no se puede saber. */
function Ganancia({ value, pct }: { value: number | null; pct: number | null }) {
  if (value === null) {
    return <span className="text-muted-foreground">—</span>;
  }
  const sube = value >= 0;
  return (
    <span className={cn("font-semibold", sube ? "text-success" : "text-warning")}>
      {sube ? "+" : "−"}
      {formatCurrency(Math.abs(value))}
      {pct !== null && <span className="ml-1 text-sm font-normal">({formatPercent(pct)})</span>}
    </span>
  );
}

const Portfolio = () => {
  const { toast } = useToast();
  const { series: chartColors } = useChartColors();
  const portfolio = usePortfolio();
  const { transactions, addTransaction, removeTransaction, setMissingCost } = portfolio;
  const { data, isPending, isError, error, refetch, isFetching } = useMarkets();

  const positions = useMemo(() => buildPositions(transactions, data), [transactions, data]);
  const totals = useMemo(() => summarize(positions, transactions), [positions, transactions]);
  const sube24h = totals.change24hPct >= 0;

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
          onRetry={() => void refetch()}
          isRetrying={isFetching}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Valor actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totals.value)}</p>
                <p
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    sube24h ? "text-success" : "text-warning",
                  )}
                >
                  {sube24h ? (
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="h-3 w-3" aria-hidden="true" />
                  )}
                  {formatPercent(totals.change24hPct)} en 24 h
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Invertido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totals.invested)}</p>
                <p className="text-xs text-muted-foreground">
                  {totals.positionsWithoutCost > 0
                    ? `${totals.positionsWithoutCost} ${
                        totals.positionsWithoutCost === 1 ? "posición" : "posiciones"
                      } sin coste, fuera del cálculo`
                    : "Coste de todo lo que tienes"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ganancia sobre el papel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">
                  <Ganancia
                    value={totals.invested > 0 ? totals.unrealizedPnl : null}
                    pct={totals.invested > 0 ? totals.unrealizedPnlPct : null}
                  />
                </p>
                <p className="text-xs text-muted-foreground">Si vendieras hoy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ganancia realizada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl">
                  <Ganancia value={totals.realizedPnl} pct={null} />
                </p>
                <p className="text-xs text-muted-foreground">De lo que ya vendiste</p>
              </CardContent>
            </Card>
          </div>

          {positions.length > 0 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={positions}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          nameKey="symbol"
                          isAnimationActive={false}
                        >
                          {positions.map((slice, index) => (
                            <Cell
                              key={slice.coinId}
                              fill={chartColors[index % chartColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<SliceTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Peso de cada moneda</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {positions.map((position, index) => {
                      const peso = totals.value > 0 ? (position.value / totals.value) * 100 : 0;
                      return (
                        <li key={position.coinId} className="space-y-1">
                          <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="font-medium">{position.symbol}</span>
                            <span className="text-muted-foreground">
                              {formatPercentShare(peso)}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${peso}%`,
                                backgroundColor: chartColors[index % chartColors.length],
                              }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {positions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Mis posiciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {positions.map((position) => (
                    <li key={position.coinId} className="rounded-lg border p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <img
                            src={position.image}
                            alt=""
                            width={40}
                            height={40}
                            loading="lazy"
                            className="h-10 w-10 flex-shrink-0 rounded-full"
                          />
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold">{position.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatAmount(position.amount)} {position.symbol} ·{" "}
                              {formatCurrency(position.price)}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-semibold">{formatCurrency(position.value)}</p>
                          <p className="text-sm">
                            <Ganancia
                              value={position.unrealizedPnl}
                              pct={position.unrealizedPnlPct}
                            />
                          </p>
                        </div>
                      </div>

                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t pt-3 text-sm">
                        <div className="flex gap-2">
                          <dt className="text-muted-foreground">Coste medio:</dt>
                          <dd className="font-medium">
                            {position.avgCost === null ? (
                              <span className="text-muted-foreground">sin registrar</span>
                            ) : (
                              formatCurrency(position.avgCost)
                            )}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-muted-foreground">Invertido:</dt>
                          <dd className="font-medium">
                            {position.invested === null ? "—" : formatCurrency(position.invested)}
                          </dd>
                        </div>
                        {position.realizedPnl !== 0 && (
                          <div className="flex gap-2">
                            <dt className="text-muted-foreground">Realizada:</dt>
                            <dd>
                              <Ganancia value={position.realizedPnl} pct={null} />
                            </dd>
                          </div>
                        )}
                      </dl>

                      {position.avgCost === null && (
                        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-md bg-muted/60 px-3 py-2">
                          <Badge variant="outline" className="gap-1">
                            <HelpCircle className="h-3 w-3" aria-hidden="true" />
                            Sin coste
                          </Badge>
                          <p className="flex-1 text-sm text-muted-foreground">
                            No sabemos a qué precio la compraste, así que no calculamos su
                            ganancia.
                          </p>
                          <SetCostDialog
                            coinId={position.coinId}
                            coinName={position.name}
                            symbol={position.symbol}
                            amount={position.amount}
                            currentPrice={position.price}
                            onConfirm={(coinId, unitPrice) => {
                              setMissingCost(coinId, unitPrice);
                              toast({
                                title: "Coste registrado",
                                description: `Ya podemos calcular la ganancia de ${position.name}.`,
                              });
                            }}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
