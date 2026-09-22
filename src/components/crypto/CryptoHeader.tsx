import { ExternalLink, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Coin } from "@/types/coin";

export interface CryptoHeaderProps {
  coin: Coin;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onExchange: () => void;
}

const CryptoHeader = ({ coin, isInWatchlist, onToggleWatchlist, onExchange }: CryptoHeaderProps) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 pr-8 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <img
          src={coin.image}
          alt=""
          width={56}
          height={56}
          className="h-12 w-12 flex-shrink-0 rounded-full sm:h-14 sm:w-14"
        />
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold sm:text-3xl">{coin.name}</h2>
          <div className="flex items-center gap-2">
            <p className="font-medium text-muted-foreground">{coin.symbol}</p>
            <Badge variant="outline">#{coin.rank}</Badge>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Button
          variant={isInWatchlist ? "default" : "outline"}
          onClick={onToggleWatchlist}
          className="min-h-11 flex-1 gap-2 sm:flex-none"
        >
          <Heart className={cn("h-4 w-4", isInWatchlist && "fill-current")} aria-hidden="true" />
          {isInWatchlist ? "En watchlist" : "Seguir"}
        </Button>
        <Button variant="outline" onClick={onExchange} className="min-h-11 flex-1 gap-2 sm:flex-none">
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Convertir
        </Button>
      </div>
    </div>
  );
};

export default CryptoHeader;
