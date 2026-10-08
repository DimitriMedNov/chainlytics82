import { SearchX, Trophy } from "lucide-react";
import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import type { CompareScreen } from "@/hooks/compare/useCompareScreen";
import { ChartSkeleton, EmptyState, ErrorState, LoadingRegion, Panel } from "@/ui/shared";
import { COMPARE_IDS } from "@/ui/pages/compare/constants";
import { EmptyAction, type EmptyActionProps } from "@/ui/pages/compare/empty-action";
import { RankingBars } from "@/ui/pages/compare/ranking-bars";
import { RankingList, RankingListSkeleton } from "@/ui/pages/compare/ranking-list";
import { RevealPanel } from "@/ui/pages/compare/reveal-panel";
import { StateSwap } from "@/ui/pages/compare/state-swap";

export interface RankingPanelProps {
  ranking: CompareScreen["ranking"];
  /** Filas del esqueleto: cuántas monedas hay elegidas. */
  skeletonRows: number;
  emptyAction: Omit<EmptyActionProps, "reason">;
}

/** Los estados sin resultados reutilizan los textos de la gráfica (mismo motivo, mismos datos). */
const TEXTS = COMPARE_TEXTS.chart;
const PADDED = "px-4 pb-4 sm:px-5 sm:pb-5";

/** Bloque «Quién lo ha hecho mejor»: barras, clasificación y sus 4 estados. */
export function RankingPanel({ ranking, skeletonRows, emptyAction }: RankingPanelProps) {
  return (
    <RevealPanel order={2} aria-labelledby={COMPARE_IDS.ranking} data-slot="compare-ranking">
      <Panel.Header>
        <Panel.Title id={COMPARE_IDS.ranking} className="flex items-center gap-2">
          <Trophy className="size-4 text-muted-foreground" aria-hidden="true" />
          {COMPARE_TEXTS.ranking.title}
        </Panel.Title>
      </Panel.Header>
      <Panel.Body padding="flush">
        {/* Las barras ya traen su entrada y las filas la suya: el estado «listo» no se funde. */}
        <StateSwap
          stateKey={ranking.status}
          fadeIn={ranking.status !== "ready"}
          className="flex flex-col gap-4"
        >
          {ranking.status === "error" ? (
            <div className={PADDED}>
              <ErrorState
                title={TEXTS.errorTitle}
                message={ranking.errorMessage}
                onRetry={ranking.retry}
                isRetrying={ranking.isRetrying}
              />
            </div>
          ) : ranking.status === "loading" ? (
            <LoadingRegion label={COMPARE_TEXTS.ranking.loadingLabel}>
              <div className="flex flex-col gap-4">
                <ChartSkeleton height="sm" className="px-4 sm:px-5" />
                <RankingListSkeleton rows={skeletonRows} />
              </div>
            </LoadingRegion>
          ) : ranking.status === "empty-selection" ? (
            <EmptyState
              icon={Trophy}
              size="sm"
              framed={false}
              title={TEXTS.emptySelectionTitle}
              description={TEXTS.emptySelectionDescription}
              headingLevel="h3"
              action={<EmptyAction reason="empty-selection" {...emptyAction} />}
            />
          ) : ranking.status === "empty-no-common" ? (
            <EmptyState
              icon={SearchX}
              size="sm"
              framed={false}
              title={TEXTS.emptyNoCommonTitle}
              description={TEXTS.emptyNoCommonDescription}
              headingLevel="h3"
              action={<EmptyAction reason="empty-no-common" {...emptyAction} />}
            />
          ) : (
            <>
              <div className="px-4 sm:px-5">
                <RankingBars bars={ranking.bars} />
              </div>
              <RankingList entries={ranking.entries} labelledBy={COMPARE_IDS.ranking} />
            </>
          )}
        </StateSwap>
      </Panel.Body>
    </RevealPanel>
  );
}
