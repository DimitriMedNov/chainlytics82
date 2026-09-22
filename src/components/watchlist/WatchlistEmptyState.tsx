import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/EmptyState";

export interface WatchlistEmptyStateProps {
  onNavigateToMarkets: () => void;
}

const WatchlistEmptyState = ({ onNavigateToMarkets }: WatchlistEmptyStateProps) => {
  return (
    <EmptyState
      icon={Star}
      title="Tu watchlist está vacía"
      description="Añade criptomonedas desde Mercados para seguir sus precios desde aquí."
      action={
        <Button onClick={onNavigateToMarkets} className="min-h-11 gap-2">
          <Search className="h-4 w-4" aria-hidden="true" />
          Explorar mercados
        </Button>
      }
    />
  );
};

export default WatchlistEmptyState;
