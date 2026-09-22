import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WatchlistItem from "./WatchlistItem";
import type { WatchlistCoin } from "@/hooks/useWatchlist";
import type { SortField, SortOrder } from "@/hooks/useWatchlistSorting";

export interface WatchlistSectionProps {
  title: string;
  items: WatchlistCoin[];
  isFavoriteSection?: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onToggleFavorite: (symbol: string) => void;
  onViewDetails: (item: WatchlistCoin) => void;
  onTrade: (item: WatchlistCoin) => void;
  onRemove: (symbol: string) => void;
}

const WatchlistSection = ({
  title,
  items,
  isFavoriteSection = false,
  sortBy,
  sortOrder,
  onSort,
  onToggleFavorite,
  onViewDetails,
  onTrade,
  onRemove,
}: WatchlistSectionProps) => {
  const arrow = sortOrder === "asc" ? "↑" : "↓";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-lg sm:text-xl">
          <span className="flex items-center gap-2">
            {isFavoriteSection && <Star className="h-5 w-5 fill-current text-chart-3" aria-hidden="true" />}
            {title}
          </span>
          {!isFavoriteSection && (
            <span className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => onSort("price")} className="min-h-11">
                Precio {sortBy === "price" && arrow}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onSort("change")} className="min-h-11">
                Cambio {sortBy === "change" && arrow}
              </Button>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-3 sm:space-y-4">
          {items.map((item) => (
            <WatchlistItem
              key={item.id}
              item={item}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
              onTrade={onTrade}
              onRemove={onRemove}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default WatchlistSection;
