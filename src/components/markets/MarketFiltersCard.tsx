import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MARKET_FILTERS,
  MARKET_SORTS,
  type MarketFilter,
  type MarketSortKey,
} from "@/hooks/useMarketFilters";

export interface MarketFiltersCardProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: MarketFilter;
  onFilterChange: (value: MarketFilter) => void;
  sortBy: MarketSortKey;
  onSortChange: (value: MarketSortKey) => void;
}

export default function MarketFiltersCard({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
}: MarketFiltersCardProps) {
  return (
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
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-11 w-full"
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full space-y-2 sm:w-[220px]">
              <Label htmlFor="markets-filter">Mostrar</Label>
              <Select value={filter} onValueChange={(value) => onFilterChange(value as MarketFilter)}>
                <SelectTrigger id="markets-filter" className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARKET_FILTERS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full space-y-2 sm:w-[220px]">
              <Label htmlFor="markets-sort">Ordenar por</Label>
              <Select value={sortBy} onValueChange={(value) => onSortChange(value as MarketSortKey)}>
                <SelectTrigger id="markets-sort" className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARKET_SORTS.map((option) => (
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
  );
}
