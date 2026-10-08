import { ChartLine, SearchX } from "lucide-react";
import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import type { RangeDays } from "@/domain/shared/range";
import type { CompareScreen } from "@/hooks/compare/useCompareScreen";
import { ChartSkeleton, EmptyState, ErrorState, LoadingRegion, Panel, RangeSelector } from "@/ui/shared";
import { ComparisonChart } from "@/ui/pages/compare/comparison-chart";
import { COMPARE_IDS } from "@/ui/pages/compare/constants";
import { EmptyAction, type EmptyActionProps } from "@/ui/pages/compare/empty-action";
import { RevealPanel } from "@/ui/pages/compare/reveal-panel";
import { StateSwap } from "@/ui/pages/compare/state-swap";

export interface ComparisonPanelProps {
  chart: CompareScreen["chart"];
  days: RangeDays;
  onDaysChange: (days: RangeDays) => void;
  /** Lo que comparten los vacíos de la pantalla para ofrecer su salida. */
  emptyAction: Omit<EmptyActionProps, "reason">;
}

const TEXTS = COMPARE_TEXTS.chart;

/** Bloque «Variación desde el inicio del periodo»: periodo, gráfica y sus 4 estados. */
export function ComparisonPanel({ chart, days, onDaysChange, emptyAction }: ComparisonPanelProps) {
  return (
    <RevealPanel order={1} aria-labelledby={COMPARE_IDS.chart} data-slot="compare-chart">
      <Panel.Header className="items-center">
        <Panel.Title id={COMPARE_IDS.chart}>{TEXTS.title}</Panel.Title>
        <Panel.Actions>
          <span className="type-eyebrow text-muted-foreground" aria-hidden="true">
            {COMPARE_TEXTS.range.title}
          </span>
          <RangeSelector value={days} onChange={onDaysChange} label={COMPARE_TEXTS.range.ariaLabel} />
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body>
        {/* La gráfica ya trae su entrada (barrido de líneas): no se le suma un fundido. */}
        <StateSwap stateKey={chart.status} fadeIn={chart.status !== "ready"}>
          {chart.status === "error" ? (
            <ErrorState
              title={TEXTS.errorTitle}
              message={chart.errorMessage}
              onRetry={chart.retry}
              isRetrying={chart.isRetrying}
            />
          ) : chart.status === "loading" ? (
            <LoadingRegion label={TEXTS.loadingLabel}>
              <ChartSkeleton height="lg" />
            </LoadingRegion>
          ) : chart.status === "empty-selection" ? (
            <EmptyState
              icon={ChartLine}
              title={TEXTS.emptySelectionTitle}
              description={TEXTS.emptySelectionDescription}
              headingLevel="h3"
              action={<EmptyAction reason="empty-selection" {...emptyAction} />}
            />
          ) : chart.status === "empty-no-common" ? (
            <EmptyState
              icon={SearchX}
              title={TEXTS.emptyNoCommonTitle}
              description={TEXTS.emptyNoCommonDescription}
              headingLevel="h3"
              action={<EmptyAction reason="empty-no-common" {...emptyAction} />}
            />
          ) : (
            <ComparisonChart rows={chart.rows} series={chart.series} coins={chart.coins} days={days} />
          )}
        </StateSwap>
      </Panel.Body>
    </RevealPanel>
  );
}
