import { ExternalLink, Eye, Star, StarOff, TrendingDown, TrendingUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { WatchlistCoin } from "@/hooks/useWatchlist";

export interface WatchlistItemProps {
  item: WatchlistCoin;
  onToggleFavorite: (symbol: string) => void;
  onViewDetails: (item: WatchlistCoin) => void;
  onTrade: (item: WatchlistCoin) => void;
  onRemove: (symbol: string) => void;
}

const WatchlistItem = ({
  item,
  onToggleFavorite,
  onViewDetails,
  onTrade,
  onRemove,
}: WatchlistItemProps) => {
  const isUp = item.change24h >= 0;

  return (
    <li className="flex flex-col justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <img
          src={item.image}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          className="h-12 w-12 flex-shrink-0 rounded-full"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold sm:text-lg">{item.name}</h3>
          <p className="text-sm font-medium text-muted-foreground">{item.symbol}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap sm:justify-end sm:gap-6">
        <div className="text-left sm:text-right">
          <p className="font-bold sm:text-lg">{formatCurrency(item.price)}</p>
          <div className="flex items-center gap-1 sm:justify-end">
            {isUp ? (
              <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-4 w-4 text-warning" aria-hidden="true" />
            )}
            <span className={cn("text-sm font-semibold", isUp ? "text-success" : "text-warning")}>
              {formatPercent(item.change24h)}
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(item.symbol)}
            aria-pressed={item.isFavorite}
            aria-label={
              item.isFavorite
                ? `Quitar ${item.name} de favoritos`
                : `Marcar ${item.name} como favorito`
            }
            className={cn("h-11 w-11", item.isFavorite ? "text-chart-3" : "text-muted-foreground")}
          >
            {item.isFavorite ? (
              <Star className="h-4 w-4 fill-current" aria-hidden="true" />
            ) : (
              <StarOff className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(item)}
            aria-label={`Ver detalles de ${item.name}`}
            className="h-11 w-11"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTrade(item)}
            aria-label={`Convertir ${item.name}`}
            className="h-11 w-11"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.symbol)}
            aria-label={`Quitar ${item.name} del watchlist`}
            className="h-11 w-11 text-destructive"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default WatchlistItem;
