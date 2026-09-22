import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface WatchlistSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const WatchlistSearch = ({ searchTerm, onSearchChange }: WatchlistSearchProps) => {
  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <Label htmlFor="watchlist-search">Buscar en tu watchlist</Label>
        <Input
          id="watchlist-search"
          type="search"
          placeholder="Por nombre o símbolo…"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-11 w-full"
        />
      </CardContent>
    </Card>
  );
};

export default WatchlistSearch;
