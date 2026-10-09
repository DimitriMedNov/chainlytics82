import { useMemo } from "react";
import { ArrowUpRight, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import { useTopCoins } from "@/hooks/panel/useTopCoins";
import { useSelectedCoin } from "@/hooks/search";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { CoinDetailDialog } from "@/ui/coin-detail";
import { RevealPanel } from "@/ui/pages/panel/motion/reveal-panel";
import { TopCoinsCharts, TopCoinsChartsSkeleton } from "@/ui/pages/panel/top-coins-charts";
import { TopCoinsTable } from "@/ui/pages/panel/top-coins-table";
import { EmptyState, ErrorState, ListSkeleton, LoadingRegion, Panel } from "@/ui/shared";

const TITLE_ID = "panel-top-titulo";
const SPLIT = "grid grid-cols-1 lg:grid-cols-3 lg:divide-x";

/** Top 5 por capitalización: tabla + barras (funciones 13 a 22). Se refresca solo cada minuto. */
export function TopCoinsPanel() {
  const top = useTopCoins();
  const detail = useSelectedCoin();
  const prices = useMemo(() => new Map(top.coins.map((coin) => [coin.id, coin.price])), [top.coins]);

  return (
    <RevealPanel aria-labelledby={TITLE_ID} data-slot="top-coins-panel">
      <Panel.Header className="items-center">
        <Panel.Title id={TITLE_ID}>{PANEL_TEXTS.top.title}</Panel.Title>
        <Panel.Actions>
          <Button asChild variant="ghost" className="min-h-11 text-link">
            <Link to={PANEL_TEXTS.top.seeAllHref}>
              {PANEL_TEXTS.top.seeAll}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </Panel.Actions>
      </Panel.Header>
      {top.status === "error" ? (
        <Panel.Body>
          <ErrorState
            title={top.errorTitle}
            message={top.errorMessage}
            onRetry={top.retry}
            isRetrying={top.isRetrying}
          />
        </Panel.Body>
      ) : top.status === "loading" ? (
        <Panel.Body padding="flush">
          <LoadingRegion label={PANEL_TEXTS.top.loading}>
            <div className={SPLIT}>
              <ListSkeleton rows={top.skeletonRows} columns={3} header className="border-t lg:col-span-2" />
              <TopCoinsChartsSkeleton />
            </div>
          </LoadingRegion>
        </Panel.Body>
      ) : top.status === "empty" ? (
        <Panel.Body>
          <EmptyState
            icon={Coins}
            headingLevel="h3"
            title={PANEL_TEXTS.top.emptyTitle}
            description={PANEL_TEXTS.top.emptyDescription}
            action={
              <Button type="button" variant="outline" className="min-h-11" onClick={top.retry} disabled={top.isRetrying}>
                {PANEL_TEXTS.top.emptyAction}
              </Button>
            }
          />
        </Panel.Body>
      ) : (
        <Panel.Body padding="flush">
          <div className={SPLIT}>
            <div className="min-w-0 border-t lg:col-span-2">
              <TopCoinsTable rows={top.rows} prices={prices} onSelect={detail.select} />
            </div>
            <TopCoinsCharts changeBars={top.changeBars} volumeBars={top.volumeBars} />
          </div>
        </Panel.Body>
      )}
      <CoinDetailDialog coin={detail.coin} open={detail.isOpen} onOpenChange={detail.setOpen} />
    </RevealPanel>
  );
}
