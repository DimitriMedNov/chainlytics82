import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipProps } from "recharts";
import { Trash2, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddHoldingDialog from "@/components/portfolio/AddHoldingDialog";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { StorageBadge } from "@/components/states/StorageBadge";
import { useToast } from "@/hooks/use-toast";
import { useMarkets } from "@/hooks/useMarketData";
import { portfolioTotals, usePortfolio, valueHoldings } from "@/hooks/usePortfolio";
import { useChartColors } from "@/hooks/useChartColors";
import type { ValuedHolding } from "@/hooks/usePortfolio";
import { formatAmount, formatCurrency, formatPercent, formatPercentShare } from "@/lib/format";
import { cn } from "@/lib/utils";

function SliceTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload as ValuedHolding;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-lg">
      <p className="font-medium">{slice.name}</p>
      <p className="text-muted-foreground">{formatCurrency(slice.value)}</p>
    </div>
  );
}

const Portfolio = () => {
  const { toast } = useToast();
  const { series: chartColors } = useChartColors();
  const portfolio = usePortfolio();
  const { holdings, addHolding, removeHolding } = portfolio;
  const { data, isPending, isError, error, refetch, isFetching } = useMarkets();

  const valued = useMemo(() => valueHoldings(holdings, data), [holdings, data]);
  const totals = useMemo(() => portfolioTotals(valued), [valued]);
  const isUp = totals.change24hPct >= 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Mi portfolio</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Tus posiciones, valoradas al precio de mercado actual
          </p>
          <div className="mt-2">
            <StorageBadge isSynced={portfolio.isSynced} />
          </div>
        </div>
        <AddHoldingDialog coins={data ?? []} onAdd={addHolding} disabled={isPending || isError} />
      </header>

      {portfolio.isError ? (
        <ErrorState
          title="No se pudo cargar tu portfolio"
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {["valor", "cambio", "posiciones"].map((key) => (
              <Skeleton key={key} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-[320px] w-full" />
        </div>
      ) : holdings.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Tu portfolio está vacío"
          description="Añade las criptomonedas que tienes y verás su valor actualizado con precios reales."
          action={<AddHoldingDialog coins={data} onAdd={addHolding} />}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Valor total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totals.value)}</p>
                <p
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    isUp ? "text-success" : "text-warning",
                  )}
                >
                  {isUp ? (
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
                  Cambio en 24 h
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn("text-2xl font-bold", isUp ? "text-success" : "text-warning")}>
                  {totals.change24hValue >= 0 ? "+" : "−"}
                  {formatCurrency(Math.abs(totals.change24hValue))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totals.best ? `Mejor: ${totals.best.symbol} (${formatPercent(totals.best.change24h)})` : "—"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Posiciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{valued.length}</p>
                <p className="text-xs text-muted-foreground">
                  {valued.length === 1 ? "criptomoneda" : "criptomonedas"}
                </p>
              </CardContent>
            </Card>
          </div>

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
                        data={valued}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        nameKey="symbol"
                        isAnimationActive={false}
                      >
                        {valued.map((slice, index) => (
                          <Cell key={slice.id} fill={chartColors[index % chartColors.length]} />
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
                  {valued.map((holding, index) => {
                    const share = totals.value > 0 ? (holding.value / totals.value) * 100 : 0;
                    return (
                      <li key={holding.id} className="space-y-1">
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span className="font-medium">{holding.symbol}</span>
                          <span className="text-muted-foreground">{formatPercentShare(share)}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${share}%`,
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

          <Card>
            <CardHeader>
              <CardTitle>Mis posiciones</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {valued.map((holding) => (
                  <li
                    key={holding.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        src={holding.image}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        className="h-10 w-10 flex-shrink-0 rounded-full"
                      />
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{holding.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatAmount(holding.amount)} {holding.symbol} · {formatCurrency(holding.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(holding.value)}</p>
                        <p
                          className={cn(
                            "text-sm",
                            holding.change24h >= 0 ? "text-success" : "text-warning",
                          )}
                        >
                          {formatPercent(holding.change24h)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 text-destructive"
                        aria-label={`Quitar ${holding.name} del portfolio`}
                        onClick={() => {
                          removeHolding(holding.id);
                          toast({
                            title: "Posición eliminada",
                            description: `${holding.name} ya no está en tu portfolio`,
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Portfolio;
