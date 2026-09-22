import { useMemo, useState } from "react";
import { BarChart3, Search, SearchX, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CryptoDetailsModal from "@/components/CryptoDetailsModal";
import { ErrorState } from "@/components/states/ErrorState";
import { EmptyState } from "@/components/states/EmptyState";
import { useMarkets } from "@/hooks/useMarketData";
import { formatCompact, formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Coin } from "@/types/coin";

type SortKey = "marketcap" | "volume" | "change" | "price" | "rank";
type Filter = "all" | "gainers" | "losers";

const FILTERS: ReadonlyArray<{ value: Filter; label: string }> = [
  { value: "all", label: "Todas las monedas" },
  { value: "gainers", label: "Suben en 24 h" },
  { value: "losers", label: "Bajan en 24 h" },
];

const SORTS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: "marketcap", label: "Capitalización" },
  { value: "volume", label: "Volumen 24 h" },
  { value: "change", label: "Cambio 24 h" },
  { value: "price", label: "Precio" },
  { value: "rank", label: "Ranking" },
];

function sortCoins(coins: Coin[], key: SortKey): Coin[] {
  const copy = [...coins];
  switch (key) {
    case "marketcap":
      return copy.sort((a, b) => b.marketCap - a.marketCap);
    case "volume":
      return copy.sort((a, b) => b.volume24h - a.volume24h);
    case "change":
      return copy.sort((a, b) => b.change24h - a.change24h);
    case "price":
      return copy.sort((a, b) => b.price - a.price);
    case "rank":
      return copy.sort((a, b) => a.rank - b.rank);
  }
}

const Markets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("marketcap");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isPending, isError, error, refetch, isFetching } = useMarkets();

  const visibleCoins = useMemo(() => {
    if (!data) return [];
    const needle = searchTerm.trim().toLowerCase();
    const filtered = data.filter((coin) => {
      const matchesSearch =
        needle === "" ||
        coin.name.toLowerCase().includes(needle) ||
        coin.symbol.toLowerCase().includes(needle);
      const matchesFilter =
        filter === "all" ||
        (filter === "gainers" && coin.change24h > 0) ||
        (filter === "losers" && coin.change24h < 0);
      return matchesSearch && matchesFilter;
    });
    return sortCoins(filtered, sortBy);
  }, [data, searchTerm, filter, sortBy]);

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

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Search className="h-5 w-5" aria-hidden="true" />
            Filtros y búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="markets-search">Buscar criptomoneda</Label>
              <Input
                id="markets-search"
                type="search"
                placeholder="Bitcoin, BTC…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full"
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="w-full space-y-2 sm:w-[220px]">
                <Label htmlFor="markets-filter">Mostrar</Label>
                <Select value={filter} onValueChange={(value) => setFilter(value as Filter)}>
                  <SelectTrigger id="markets-filter" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTERS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full space-y-2 sm:w-[220px]">
                <Label htmlFor="markets-sort">Ordenar por</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortKey)}>
                  <SelectTrigger id="markets-sort" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORTS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <Button
                  variant="outline"
                  className="min-h-11"
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                >
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3 sm:space-y-4">
              {visibleCoins.map((coin) => (
                <li
                  key={coin.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
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
                        {coin.change24h >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-warning" aria-hidden="true" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-medium",
                            coin.change24h >= 0 ? "text-success" : "text-warning",
                          )}
                        >
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
                      onClick={() => openDetails(coin)}
                      className="min-h-11 flex-shrink-0"
                    >
                      Ver detalles
                      <span className="sr-only"> de {coin.name}</span>
                    </Button>
                  </div>
                </li>
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
