import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Coin } from "@/types/coin";

export interface CryptoPriceSectionProps {
  coin: Coin;
}

const CryptoPriceSection = ({ coin }: CryptoPriceSectionProps) => {
  const isUp = coin.change24h >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
      <div className="space-y-2 sm:space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Precio actual</p>
        <p className="text-2xl font-bold sm:text-4xl">{formatCurrency(coin.price)}</p>
        <div className="flex items-center gap-2 sm:gap-3">
          {isUp ? (
            <TrendingUp className="h-5 w-5 text-success" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-5 w-5 text-warning" aria-hidden="true" />
          )}
          <Badge variant={isUp ? "default" : "destructive"} className="px-2 py-1 text-sm font-semibold">
            {formatPercent(coin.change24h)}
          </Badge>
          <span className="text-sm text-muted-foreground">24 h</span>
          {coin.change7d !== null && (
            <span className="text-sm text-muted-foreground">
              · {formatPercent(coin.change7d)} en 7 d
            </span>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1">
          <dt className="text-sm text-muted-foreground">Máximo 24 h</dt>
          <dd className="font-bold text-success sm:text-xl">{formatCurrency(coin.high24h)}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-sm text-muted-foreground">Mínimo 24 h</dt>
          <dd className="font-bold text-warning sm:text-xl">{formatCurrency(coin.low24h)}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-sm text-muted-foreground">Máximo histórico</dt>
          <dd className="font-semibold sm:text-lg">{formatCurrency(coin.ath)}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-sm text-muted-foreground">Mínimo histórico</dt>
          <dd className="font-semibold sm:text-lg">{formatCurrency(coin.atl)}</dd>
        </div>
      </dl>
    </div>
  );
};

export default CryptoPriceSection;
