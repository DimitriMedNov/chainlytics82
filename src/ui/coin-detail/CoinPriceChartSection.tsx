import { useId } from "react";
import { ChartNoAxesColumn } from "lucide-react";
import { motion } from "motion/react";
import { COIN_DETAIL_TEXTS as T } from "@/application/coin-detail/presentation/texts";
import type { CoinDetailChart } from "@/hooks/coin-detail/useCoinDetailChart";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { ChartSkeleton, EmptyState, ErrorState, LoadingRegion, Panel, RangeSelector } from "@/ui/shared";
import { PriceChart } from "@/ui/coin-detail/PriceChart";
import { FADE_HIDDEN, FADE_TRANSITION, FADE_VISIBLE } from "@/ui/coin-detail/useCoinDetailMotion";

export interface CoinPriceChartSectionProps {
  chart: CoinDetailChart;
  coinName: string;
}

/**
 * Bloque «Evolución del precio»: título, selector de rango (visible en los 4
 * estados) y el hueco de la gráfica con error, cargando, vacío y éxito. Cada
 * estado entra con un fundido corto (Motion) en el hueco ya reservado; el
 * anterior se quita al instante para no retrasar al nuevo.
 */
export function CoinPriceChartSection({ chart, coinName }: CoinPriceChartSectionProps) {
  const titleId = useId();

  return (
    <Panel surface="plain" aria-labelledby={titleId} data-slot="coin-price-chart" data-status={chart.status}>
      <Panel.Header className="items-center px-0 pt-0 sm:px-0 sm:pt-0">
        <Panel.Title as="h3" id={titleId}>
          {T.chartTitle}
        </Panel.Title>
        <Panel.Actions>
          <RangeSelector value={chart.days} onChange={chart.setDays} label={T.rangeSelectorLabel} />
        </Panel.Actions>
      </Panel.Header>

      <Panel.Body padding="none" className="flex min-h-72 flex-col justify-center pt-3">
        <motion.div
          key={chart.status}
          data-slot="coin-price-chart-state"
          initial={FADE_HIDDEN}
          animate={FADE_VISIBLE}
          transition={FADE_TRANSITION}
        >
          {chart.status === "error" ? (
            <ErrorState
              title={T.chartErrorTitle}
              message={chart.errorMessage}
              onRetry={chart.retry}
              isRetrying={chart.isRetrying}
            />
          ) : chart.status === "loading" ? (
            <LoadingRegion label={T.chartLoading}>
              <ChartSkeleton height="md" />
            </LoadingRegion>
          ) : chart.status === "empty" ? (
            <EmptyState
              icon={ChartNoAxesColumn}
              headingLevel="h4"
              size="sm"
              title={T.chartEmptyTitle}
              description={T.chartEmptyDescription}
              action={
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={chart.retry}
                  disabled={chart.isRetrying}
                >
                  {chart.isRetrying ? T.chartRetrying : T.chartEmptyAction}
                </Button>
              }
            />
          ) : (
            <PriceChart points={chart.points} summary={chart.summary} coinName={coinName} />
          )}
        </motion.div>
      </Panel.Body>
    </Panel>
  );
}
