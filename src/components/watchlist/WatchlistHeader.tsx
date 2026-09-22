import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StorageBadge } from "@/components/states/StorageBadge";

export interface WatchlistHeaderProps {
  itemCount: number;
  onSort: () => void;
  isSynced: boolean;
}

const WatchlistHeader = ({ itemCount, onSort, isSynced }: WatchlistHeaderProps) => {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Mi watchlist</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {itemCount === 0
            ? "Aún no sigues ninguna moneda"
            : `Sigues ${itemCount} ${itemCount === 1 ? "moneda" : "monedas"}, con precios en vivo`}
        </p>
        <div className="mt-2">
          <StorageBadge isSynced={isSynced} />
        </div>
      </div>
      {itemCount > 0 && (
        <Button variant="outline" onClick={onSort} className="min-h-11 w-full gap-2 sm:w-auto">
          <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
          Ordenar por nombre
        </Button>
      )}
    </header>
  );
};

export default WatchlistHeader;
