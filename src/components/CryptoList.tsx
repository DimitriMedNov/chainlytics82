import { ArrowDownIcon, ArrowUpIcon, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { useMarkets } from "@/hooks/useMarketData";
import { formatCompact, formatCurrency, formatPercent } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { cn } from "@/lib/utils";

const VISIBLES = 5;

/** Top 5 de monedas del dashboard. Comparte la consulta con el resto de la app. */
const CryptoList = () => {
  const { data, isPending, isError, error, refetch, isFetching } = useMarkets();

  if (isError) {
    return (
      <ErrorState
        title="No se pudo cargar el top de criptomonedas"
        message={error.message}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  if (isPending) {
    return (
      <section className="glass-card rounded-lg p-6" aria-busy="true">
        <Skeleton className="mb-6 h-6 w-48" />
        <div className="space-y-4">
          {Array.from({ length: VISIBLES }, (_, index) => `fila-${index}`).map((key) => (
            <div key={key} className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="hidden h-4 w-16 sm:block" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const top = data.slice(0, VISIBLES);

  if (top.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="Sin monedas que mostrar"
        description="El servicio de precios no devolvió ninguna moneda en este momento."
        action={
          <Button variant="outline" className="min-h-11" onClick={() => void refetch()}>
            Volver a intentar
          </Button>
        }
      />
    );
  }

  return (
    <section className="glass-card animate-fade-in rounded-lg border border-border/20 p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Top criptomonedas</h2>
        <Button asChild variant="ghost" size="sm" className="min-h-11">
          <Link to="/markets">Ver todas</Link>
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full min-w-[480px]">
          <caption className="sr-only">Las {VISIBLES} criptomonedas con mayor capitalización</caption>
          <thead>
            <tr className="border-b border-border/30 text-left text-sm text-muted-foreground">
              <th scope="col" className="pb-4 font-medium">Nombre</th>
              <th scope="col" className="pb-4 font-medium">Precio</th>
              <th scope="col" className="pb-4 font-medium">Cambio 24 h</th>
              <th scope="col" className="pb-4 font-medium">Volumen</th>
            </tr>
          </thead>
          <tbody>
            {top.map((crypto) => (
              <tr key={crypto.id} className="border-t border-border/20 transition-colors hover:bg-muted/20">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={crypto.image}
                      alt=""
                      width={32}
                      height={32}
                      loading="lazy"
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-semibold">{formatCurrency(crypto.price)}</td>
                <td className="py-4">
                  <span
                    className={cn(
                      "flex items-center gap-1 font-medium",
                      crypto.change24h >= 0 ? "text-success" : "text-warning",
                    )}
                  >
                    {crypto.change24h >= 0 ? (
                      <ArrowUpIcon className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" aria-hidden="true" />
                    )}
                    {formatPercent(crypto.change24h)}
                  </span>
                </td>
                <td className="py-4 font-medium">{formatCompact(crypto.volume24h)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CryptoList;
