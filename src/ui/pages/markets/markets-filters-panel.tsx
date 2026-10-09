import { MARKETS_TEXTS, MARKET_FILTERS, MARKET_SORTS } from "@/application/markets/presentation/texts";
import { isMarketFilter, type MarketFilter } from "@/domain/markets/filters";
import { isMarketSortKey, type MarketSortKey } from "@/domain/markets/sorting";
import { Label } from "@/ui/base/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/base/select";
import { FloatingSearchField } from "@/ui/pages/markets/floating-search-field";
import { Panel } from "@/ui/shared";

export interface MarketsFiltersPanelProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  filter: MarketFilter;
  onFilterChange: (value: MarketFilter) => void;
  sortBy: MarketSortKey;
  onSortByChange: (value: MarketSortKey) => void;
}

const TITLE_ID = "markets-filters-titulo";
const FIELD = "flex min-w-0 flex-col gap-1.5";
const TRIGGER = "min-h-11 w-full";

/** Tarjeta «Filtros y búsqueda» (funciones 2 a 5): buscador, «Mostrar» y «Ordenar por». */
export function MarketsFiltersPanel({
  searchTerm,
  onSearchTermChange,
  filter,
  onFilterChange,
  sortBy,
  onSortByChange,
}: MarketsFiltersPanelProps) {
  return (
    <Panel aria-labelledby={TITLE_ID} data-slot="markets-filters">
      <Panel.Header>
        <Panel.Title id={TITLE_ID}>{MARKETS_TEXTS.filtersTitle}</Panel.Title>
      </Panel.Header>
      <Panel.Body>
        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 sm:pt-0 lg:grid-cols-4">
          {/* Abajo de su celda, a la altura de los desplegables; el `pt-2` de la rejilla es el hueco al que sube la etiqueta en móvil. */}
          <FloatingSearchField
            id="markets-search"
            label={MARKETS_TEXTS.searchLabel}
            placeholder={MARKETS_TEXTS.searchPlaceholder}
            value={searchTerm}
            onValueChange={onSearchTermChange}
            className="self-end sm:col-span-2"
          />
          <div className={FIELD}>
            <Label htmlFor="markets-filter">{MARKETS_TEXTS.filterLabel}</Label>
            <Select
              value={filter}
              onValueChange={(value) => {
                if (isMarketFilter(value)) onFilterChange(value);
              }}
            >
              <SelectTrigger id="markets-filter" className={TRIGGER}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARKET_FILTERS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="min-h-11">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className={FIELD}>
            <Label htmlFor="markets-sort">{MARKETS_TEXTS.sortLabel}</Label>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                if (isMarketSortKey(value)) onSortByChange(value);
              }}
            >
              <SelectTrigger id="markets-sort" className={TRIGGER}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARKET_SORTS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="min-h-11">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Panel.Body>
    </Panel>
  );
}
