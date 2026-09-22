import { useState } from "react";
import { BarChart3, SearchX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CryptoDetailsModal from "@/components/CryptoDetailsModal";
import MarketCoinRow from "@/components/markets/MarketCoinRow";
import MarketFiltersCard from "@/components/markets/MarketFiltersCard";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useMarkets } from "@/hooks/useMarketData";
import { useMarketFilters } from "@/hooks/useMarketFilters";
import type { Coin } from "@/types/coin";

const Markets = () => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isPending, isError, error, refetch, isFetching } = useMarkets();
  const filters = useMarketFilters(data);
  const { visibleCoins } = filters;

  const openDetails = (coin: Coin) => {
    setSelectedCoin(coin);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <header>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Mercados</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Las 100 criptomonedas con mayor capitalización, con precios en vivo
        </p>
      </header>

      <MarketFiltersCard
        searchTerm={filters.searchTerm}
        onSearchChange={filters.setSearchTerm}
        filter={filters.filter}
        onFilterChange={filters.setFilter}
        sortBy={filters.sortBy}
        onSortChange={filters.setSortBy}
      />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
            {isPending || isError ? "Criptomonedas" : `${visibleCoins.length} criptomonedas`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isError ? (
            <ErrorState
              title="No se pudo cargar el mercado"
              message={error.message}
              onRetry={() => void refetch()}
              isRetrying={isFetching}
            />
          ) : isPending ? (
            <ul className="space-y-3 sm:space-y-4" aria-busy="true">
              {Array.from({ length: 8 }, (_, index) => `fila-${index}`).map((key) => (
                <li key={key} className="flex items-center gap-4 rounded-lg border p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </li>
              ))}
            </ul>
          ) : visibleCoins.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Ninguna moneda coincide"
              description="Prueba con otro nombre o quita los filtros para ver el listado completo."
              action={
                <Button variant="outline" className="min-h-11" onClick={filters.clear}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3 sm:space-y-4">
              {visibleCoins.map((coin) => (
                <MarketCoinRow key={coin.id} coin={coin} onViewDetails={openDetails} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <CryptoDetailsModal open={modalOpen} onOpenChange={setModalOpen} coin={selectedCoin} />
    </div>
  );
};

export default Markets;
