import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Ganancia from "@/components/portfolio/Ganancia";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PortfolioSummary } from "@/types/portfolio";

export interface PortfolioSummaryCardsProps {
  totals: PortfolioSummary;
}

function SummaryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** Las cuatro cifras de cabecera: valor, invertido y las dos ganancias. */
export default function PortfolioSummaryCards({ totals }: PortfolioSummaryCardsProps) {
  const sube24h = totals.change24hPct >= 0;
  const sinCoste = totals.positionsWithoutCost;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard title="Valor actual">
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
      </SummaryCard>

      <SummaryCard title="Invertido">
        <p className="text-2xl font-bold">{formatCurrency(totals.invested)}</p>
        <p className="text-xs text-muted-foreground">
          {sinCoste > 0
            ? `${sinCoste} ${sinCoste === 1 ? "posición" : "posiciones"} sin coste, fuera del cálculo`
            : "Coste de todo lo que tienes"}
        </p>
      </SummaryCard>

      <SummaryCard title="Ganancia sobre el papel">
        <p className="text-2xl">
          <Ganancia
            value={totals.invested > 0 ? totals.unrealizedPnl : null}
            pct={totals.invested > 0 ? totals.unrealizedPnlPct : null}
          />
        </p>
        <p className="text-xs text-muted-foreground">Si vendieras hoy</p>
      </SummaryCard>

      <SummaryCard title="Ganancia realizada">
        <p className="text-2xl">
          <Ganancia value={totals.realizedPnl} pct={null} />
        </p>
        <p className="text-xs text-muted-foreground">De lo que ya vendiste</p>
      </SummaryCard>
    </div>
  );
}
