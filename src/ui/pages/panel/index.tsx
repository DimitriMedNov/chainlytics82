import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import { useSearch } from "@/hooks/search";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { AnimateIcon } from "@/ui/animate-ui/icons/icon";
import { Search } from "@/ui/animate-ui/icons/search";
import { BitcoinHistoryPanel } from "@/ui/pages/panel/bitcoin-history-panel";
import { MarketStatsSection } from "@/ui/pages/panel/market-stats-section";
import { TopCoinsPanel } from "@/ui/pages/panel/top-coins-panel";
import { TradingViewPanel } from "@/ui/pages/panel/trading-view-panel";
import { PageContainer, PageGrid, PageHeader } from "@/ui/shared";

/**
 * Panel (`/`): cifras del mercado, las dos gráficas de Bitcoin y el top 5.
 * Cada bloque trae sus datos con su hook y resuelve sus 4 estados.
 */
export default function PanelPage() {
  const { open: openSearch } = useSearch();

  return (
    <PageContainer>
      <PageHeader
        title={PANEL_TEXTS.title}
        description={PANEL_TEXTS.subtitle}
        actions={
          <AnimateIcon animateOnHover="find" asChild>
            <Button type="button" variant="outline" className="min-h-11" onClick={openSearch}>
              <Search aria-hidden="true" />
              {PANEL_TEXTS.searchCoins}
            </Button>
          </AnimateIcon>
        }
      />
      <MarketStatsSection />
      <PageGrid layout="halves">
        <BitcoinHistoryPanel />
        <TradingViewPanel />
      </PageGrid>
      <TopCoinsPanel />
    </PageContainer>
  );
}
