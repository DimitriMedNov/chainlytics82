import { BarChart3, DollarSign } from "lucide-react";
import { formatCompact, formatSupply } from "@/lib/format";
import type { Coin } from "@/types/coin";

export interface CryptoMarketStatsProps {
  coin: Coin;
}

const CryptoMarketStats = ({ coin }: CryptoMarketStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
      <section className="rounded-xl border bg-muted/30 p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-chart-2" aria-hidden="true" />
          <h3 className="font-semibold sm:text-lg">Capitalización de mercado</h3>
        </div>
        <p className="mb-3 text-xl font-bold sm:text-3xl">{formatCompact(coin.marketCap)}</p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Totalmente diluida:</dt>
            <dd className="font-medium">
              {coin.fdv === null ? "No disponible" : formatCompact(coin.fdv)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Ranking global:</dt>
            <dd className="font-medium">#{coin.rank}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border bg-muted/30 p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-chart-4" aria-hidden="true" />
          <h3 className="font-semibold sm:text-lg">Volumen y oferta</h3>
        </div>
        <p className="mb-3 text-xl font-bold sm:text-3xl">{formatCompact(coin.volume24h)}</p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Oferta circulante:</dt>
            <dd className="font-medium">{formatSupply(coin.circulatingSupply)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Oferta total:</dt>
            <dd className="font-medium">{formatSupply(coin.totalSupply)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};

export default CryptoMarketStats;
