import { MARKETS_TEXTS, barsDescription } from "@/application/markets/presentation/texts";
import type { ChangeBar, TrendSlice } from "@/domain/markets/charts";
import type { MarketListStatus } from "@/domain/markets/listing";
import { ChartBlock } from "@/ui/pages/markets/chart-block";
import { ChangeBarsSkeleton, TrendRingSkeleton } from "@/ui/pages/markets/chart-skeletons";
import { CHANGE_BARS_LIMIT, ChangeBarsChart } from "@/ui/pages/markets/charts/change-bars-chart";
import { TrendRingChart } from "@/ui/pages/markets/charts/trend-ring-chart";
import { PageGrid } from "@/ui/shared";

export interface MarketsChartsSectionProps {
  status: MarketListStatus;
  /** Una barra por moneda visible, en el orden de la lista. */
  changeBars: readonly ChangeBar[];
  trendBreakdown: readonly TrendSlice[];
  errorMessage: string;
  isFetching: boolean;
  onRetry: () => void;
}

/** Las dos gráficas de la lista visible: barras de cambio en 24 h y anillo suben / bajan. */
export function MarketsChartsSection({ status, changeBars, trendBreakdown, ...shared }: MarketsChartsSectionProps) {
  const shownBars = changeBars.slice(0, CHANGE_BARS_LIMIT);

  return (
    <PageGrid layout="main" data-slot="markets-charts">
      <ChartBlock
        {...shared}
        status={status}
        index={0}
        slot="markets-bars-panel"
        titleId="markets-bars-titulo"
        title={MARKETS_TEXTS.barsTitle}
        description={status === "ready" ? barsDescription(shownBars.length, changeBars.length) : undefined}
        loadingLabel={MARKETS_TEXTS.barsLoading}
        skeleton={<ChangeBarsSkeleton />}
        bodyClassName="min-h-72"
      >
        <ChangeBarsChart bars={shownBars} title={MARKETS_TEXTS.barsTitle} />
      </ChartBlock>
      <ChartBlock
        {...shared}
        status={status}
        index={1}
        slot="markets-trend-panel"
        titleId="markets-trend-titulo"
        title={MARKETS_TEXTS.trendTitle}
        description={MARKETS_TEXTS.trendDescription}
        loadingLabel={MARKETS_TEXTS.trendLoading}
        skeleton={<TrendRingSkeleton />}
        // Lo que mide el anillo con su leyenda: apilados (móvil y `lg`) o en fila (`sm`).
        bodyClassName="min-h-71 sm:min-h-48 lg:min-h-71"
      >
        <TrendRingChart slices={trendBreakdown} />
      </ChartBlock>
    </PageGrid>
  );
}
