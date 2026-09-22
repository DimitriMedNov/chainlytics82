import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
import CryptoDetailsModal from "@/components/CryptoDetailsModal";
import WatchlistHeader from "@/components/watchlist/WatchlistHeader";
import WatchlistSearch from "@/components/watchlist/WatchlistSearch";
import WatchlistEmptyState from "@/components/watchlist/WatchlistEmptyState";
import WatchlistSection from "@/components/watchlist/WatchlistSection";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useMarkets } from "@/hooks/useMarketData";
import { joinWithMarket, useWatchlist, type WatchlistCoin } from "@/hooks/useWatchlist";
import { useWatchlistSorting } from "@/hooks/useWatchlistSorting";
import type { Coin } from "@/types/coin";

const Watchlist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const watchlist = useWatchlist();
  const { entries, remove, toggleFavorite } = watchlist;
  const { data, isPending, isError, error, refetch, isFetching } = useMarkets();

  const coins = useMemo(() => joinWithMarket(entries, data), [entries, data]);

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (needle === "") return coins;
    return coins.filter(
      (item) =>
        item.name.toLowerCase().includes(needle) || item.symbol.toLowerCase().includes(needle),
    );
  }, [coins, searchTerm]);

  const { sortBy, sortOrder, sortedItems, handleSort } = useWatchlistSorting(filteredItems);

  const favoriteItems = sortedItems.filter((item) => item.isFavorite);
  const otherItems = sortedItems.filter((item) => !item.isFavorite);

  const handleRemove = (symbol: string) => {
    const item = coins.find((coin) => coin.symbol === symbol);
    remove(symbol);
    toast({
      title: "Eliminada del watchlist",
      description: `${item?.name ?? symbol} ya no está en tu lista`,
    });
  };

  const handleTrade = (item: WatchlistCoin) => {
    navigate("/converter");
    toast({
      title: "Vamos al convertidor",
      description: `Ahí puedes convertir ${item.name}`,
    });
  };

  const actions = {
    onToggleFavorite: toggleFavorite,
    onRemove: handleRemove,
    onViewDetails: (item: WatchlistCoin) => {
      setSelectedCoin(item);
      setIsModalOpen(true);
    },
    onTrade: handleTrade,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
      <WatchlistHeader
        itemCount={entries.length}
        onSort={() => handleSort("name")}
        isSynced={watchlist.isSynced}
      />

      {watchlist.isError ? (
        <ErrorState
          title="No se pudo cargar tu watchlist"
          message={watchlist.errorMessage}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      ) : watchlist.isPending ? (
        <div className="space-y-4" aria-busy="true">
          {Array.from({ length: 3 }, (_, index) => `carga-${index}`).map((key) => (
            <Skeleton key={key} className="h-24 w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <WatchlistEmptyState onNavigateToMarkets={() => navigate("/markets")} />
      ) : isError ? (
        <ErrorState
          title="No se pudieron cargar los precios"
          message={error.message}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      ) : isPending ? (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-24 w-full" />
          {Array.from({ length: 3 }, (_, index) => `fila-${index}`).map((key) => (
            <Skeleton key={key} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <>
          <WatchlistSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {sortedItems.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Ninguna coincidencia"
              description="Ninguna moneda de tu watchlist coincide con esa búsqueda."
              action={
                <Button variant="outline" className="min-h-11" onClick={() => setSearchTerm("")}>
                  Limpiar búsqueda
                </Button>
              }
            />
          ) : (
            <>
              {favoriteItems.length > 0 && (
                <WatchlistSection
                  title={`Favoritas (${favoriteItems.length})`}
                  items={favoriteItems}
                  isFavoriteSection
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  {...actions}
                />
              )}

              {otherItems.length > 0 && (
                <WatchlistSection
                  title={`Todas (${otherItems.length})`}
                  items={otherItems}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  {...actions}
                />
              )}
            </>
          )}
        </>
      )}

      <CryptoDetailsModal open={isModalOpen} onOpenChange={setIsModalOpen} coin={selectedCoin} />
    </div>
  );
};

export default Watchlist;
