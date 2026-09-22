import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Convertible } from "@/hooks/useConvertibles";

export interface QuickRatesProps {
  options: Convertible[];
  isPending: boolean;
}

const QuickRates = ({ options, isPending }: QuickRatesProps) => {
  const top = options.filter((option) => option.kind === "cripto").slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tasas actuales</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => `tasa-${index}`).map((key) => (
              <Skeleton key={key} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {top.map((option) => (
              <li
                key={option.code}
                className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {option.image && (
                    <img
                      src={option.image}
                      alt=""
                      width={32}
                      height={32}
                      loading="lazy"
                      className="h-8 w-8 flex-shrink-0 rounded-full"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold">{option.code}</p>
                    <p className="truncate text-xs text-muted-foreground">{option.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(option.usdPrice)}</p>
                  {option.change24h !== null && (
                    <p
                      className={cn(
                        "flex items-center justify-end gap-1 text-xs",
                        option.change24h >= 0 ? "text-success" : "text-warning",
                      )}
                    >
                      {option.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <TrendingDown className="h-3 w-3" aria-hidden="true" />
                      )}
                      {formatPercent(option.change24h)}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickRates;
