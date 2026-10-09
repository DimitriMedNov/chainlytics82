import { MARKETS_TEXTS } from "@/application/markets/presentation/texts";
import { useCoinDetailSelection } from "@/hooks/markets/useCoinDetailSelection";
import { useMarketFilters } from "@/hooks/markets/useMarketFilters";
import { CoinDetailDialog } from "@/ui/coin-detail";
import { MarketsChartsSection } from "@/ui/pages/markets/markets-charts-section";
import { MarketsFiltersPanel } from "@/ui/pages/markets/markets-filters-panel";
import { MarketsListPanel } from "@/ui/pages/markets/markets-list-panel";
import { PageContainer, PageHeader } from "@/ui/shared";

/**
 * Mercados (`/markets`): filtros, las dos gráficas de la lista visible y las 100
 * monedas. Los datos y el refresco de cada minuto vienen de `useMarketFilters`.
 */
export default function MarketsPage() {
  const markets = useMarketFilters();
  const detail = useCoinDetailSelection();

  return (
    <PageContainer data-slot="markets-page">
      <PageHeader title={MARKETS_TEXTS.title} description={MARKETS_TEXTS.subtitle} />
      <MarketsFiltersPanel
        searchTerm={markets.searchTerm}
        onSearchTermChange={markets.setSearchTerm}
        filter={markets.filter}
        onFilterChange={markets.setFilter}
        sortBy={markets.sortBy}
        onSortByChange={markets.setSortBy}
      />
      <MarketsChartsSection
        status={markets.status}
        changeBars={markets.changeBars}
        trendBreakdown={markets.trendBreakdown}
        errorMessage={markets.errorMessage}
        isFetching={markets.isFetching}
        onRetry={markets.refetch}
      />
      <MarketsListPanel
        status={markets.status}
        title={markets.listTitle}
        coins={markets.visibleCoins}
        errorMessage={markets.errorMessage}
        isFetching={markets.isFetching}
        onRetry={markets.refetch}
        onClearFilters={markets.clear}
        onViewDetails={detail.openDetails}
      />
      <CoinDetailDialog coin={detail.selectedCoin} open={detail.isOpen} onOpenChange={detail.setOpen} />
    </PageContainer>
  );
}
