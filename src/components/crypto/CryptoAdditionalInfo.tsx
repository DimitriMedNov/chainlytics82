import { formatPercent } from "@/lib/format";
import type { Coin } from "@/types/coin";

export interface CryptoAdditionalInfoProps {
  coin: Coin;
}

const CryptoAdditionalInfo = ({ coin }: CryptoAdditionalInfoProps) => {
  return (
    <section className="rounded-xl border bg-muted/50 p-4 sm:p-6">
      <h3 className="mb-4 font-semibold sm:text-lg">Información adicional</h3>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-muted-foreground">Símbolo:</dt>
          <dd className="font-medium">{coin.symbol}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-muted-foreground">Id en CoinGecko:</dt>
          <dd className="truncate font-medium">{coin.id}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-muted-foreground">Distancia a su máximo:</dt>
          <dd className="font-medium">{formatPercent(coin.athChangePct)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-muted-foreground">Cambio en 7 días:</dt>
          <dd className="font-medium">
            {coin.change7d === null ? "No disponible" : formatPercent(coin.change7d)}
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default CryptoAdditionalInfo;
