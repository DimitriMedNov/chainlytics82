import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from "lucide-react";
import { useGlobalMarket } from "@/hooks/useMarketData";
import { formatCompact, formatPercent } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/states/ErrorState";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  changePct?: number;
}

function StatCard({ label, value, changePct }: StatCardProps) {
  const isUp = (changePct ?? 0) >= 0;

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <TrendingUpIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {changePct !== undefined && (
        <span className={cn("flex items-center gap-1 text-sm", isUp ? "text-success" : "text-warning")}>
          {isUp ? (
            <ArrowUpIcon className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ArrowDownIcon className="h-3 w-3" aria-hidden="true" />
          )}
          {formatPercent(changePct)} (24 h)
        </span>
      )}
    </div>
  );
}

/** Cifras globales del mercado, en vivo desde CoinGecko. */
const MarketStats = () => {
  const { data, isPending, isError, error, refetch, isFetching } = useGlobalMarket();

  if (isError) {
    return (
      <ErrorState
        className="mb-8"
        title="No se pudieron cargar las cifras del mercado"
        message={error.message}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  if (isPending) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {["cap", "volumen", "dominancia"].map((key) => (
          <div key={key} className="glass-card space-y-3 rounded-lg p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8 grid animate-fade-in grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        label="Capitalización total"
        value={formatCompact(data.totalMarketCap)}
        changePct={data.marketCapChange24hPct}
      />
      <StatCard label="Volumen 24 h" value={formatCompact(data.totalVolume24h)} />
      <StatCard label="Dominancia BTC" value={`${data.btcDominance.toFixed(1)} %`} />
    </div>
  );
};

export default MarketStats;
