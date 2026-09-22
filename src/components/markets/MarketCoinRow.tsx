import { TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCompact, formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Coin } from "@/types/coin";

export interface MarketCoinRowProps {
  coin: Coin;
  onViewDetails: (coin: Coin) => void;
}

/** Una fila del listado de mercados. Capitalización y volumen se esconden en pantallas pequeñas. */
export default function MarketCoinRow({ coin, onViewDetails }: MarketCoinRowProps) {
  const sube = coin.change24h >= 0;

  return (
    <li className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <span className="w-8 flex-shrink-0 text-sm font-semibold text-muted-foreground">
          #{coin.rank}
        </span>
        <img
          src={coin.image}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="h-10 w-10 flex-shrink-0 rounded-full"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{coin.name}</h3>
          <p className="text-sm text-muted-foreground">{coin.symbol}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6 lg:gap-8">
        <div className="text-right">
          <p className="font-semibold">{formatCurrency(coin.price)}</p>
          <div className="flex items-center gap-1 sm:justify-end">
            {sube ? (
              <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-4 w-4 text-warning" aria-hidden="true" />
            )}
            <span className={cn("text-sm font-medium", sube ? "text-success" : "text-warning")}>
              {formatPercent(coin.change24h)}
            </span>
          </div>
        </div>

        <div className="hidden text-right sm:block">
          <p className="font-semibold">{formatCompact(coin.marketCap)}</p>
          <p className="text-xs text-muted-foreground">Capitalización</p>
        </div>

        <div className="hidden text-right lg:block">
          <p className="font-semibold">{formatCompact(coin.volume24h)}</p>
          <p className="text-xs text-muted-foreground">Volumen 24 h</p>
        </div>

        <Button
          variant="outline"
          onClick={() => onViewDetails(coin)}
          className="min-h-11 flex-shrink-0"
        >
          Ver detalles
          <span className="sr-only"> de {coin.name}</span>
        </Button>
      </div>
    </li>
  );
}
