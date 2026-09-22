import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SeriesResult } from "@/lib/compareMath";
import type { Coin } from "@/types/coin";

export interface ComparisonRankingProps {
  results: SeriesResult[];
  coins: Coin[];
  colors: string[];
}

/** Clasificación de mejor a peor, con el mismo color que su línea en el gráfico. */
export default function ComparisonRanking({ results, coins, colors }: ComparisonRankingProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Trophy className="h-5 w-5" aria-hidden="true" />
          Quién lo ha hecho mejor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {results.map((result, index) => {
            const colorIndex = coins.findIndex((c) => c.id === result.coinId);
            const coin = coins[colorIndex];
            const sube = result.changePct >= 0;
            return (
              <li
                key={result.coinId}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-6 flex-shrink-0 text-sm font-semibold text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: colors[colorIndex % colors.length] }}
                  />
                  {coin && (
                    <img
                      src={coin.image}
                      alt=""
                      width={32}
                      height={32}
                      loading="lazy"
                      className="h-8 w-8 flex-shrink-0 rounded-full"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{coin?.name ?? result.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(result.firstPrice)} → {formatCurrency(result.lastPrice)}
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    "text-lg font-bold sm:text-xl",
                    sube ? "text-success" : "text-warning",
                  )}
                >
                  {formatPercent(result.changePct)}
                </p>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
