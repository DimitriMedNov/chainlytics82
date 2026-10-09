import { useId } from "react";
import type { WatchlistScreen } from "@/hooks/watchlist-screen/useWatchlistScreen";
import { ChangeBarsChart, ChangeBarsChartSkeleton } from "@/ui/pages/watchlist/charts/change-bars-chart";
import { WATCHLIST_TEXTS } from "@/application/watchlist-screen/texts";
import { EmptyState, ErrorState, LoadingRegion, Panel } from "@/ui/shared";

export interface ChangeBarsPanelProps {
  state: WatchlistScreen["state"];
  series: WatchlistScreen["chartSeries"];
}

function ChangeBarsBody({ state, series }: ChangeBarsPanelProps) {
  switch (state.kind) {
    case "list-error":
    case "prices-error":
      return (
        <ErrorState
          title={state.title}
          message={state.message}
          onRetry={state.onRetry}
          isRetrying={state.isRetrying}
        />
      );
    case "list-loading":
    case "prices-loading":
      return (
        <LoadingRegion label={WATCHLIST_TEXTS.loadingChart}>
          <ChangeBarsChartSkeleton />
        </LoadingRegion>
      );
    case "empty":
    case "outside-top":
    case "no-matches":
      return (
        // La salida del vacío está una sola vez, en la tarjeta de la lista.
        <EmptyState
          title={state.title}
          headingLevel="h3"
          size="sm"
          framed={false}
        />
      );
    case "ready":
      return <ChangeBarsChart series={series} />;
  }
}

/** Gráfica «Cambio en 24 h» de las monedas visibles, con sus cuatro estados. */
export function ChangeBarsPanel({ state, series }: ChangeBarsPanelProps) {
  const titleId = useId();

  return (
    <Panel aria-labelledby={titleId} data-slot="watchlist-chart" data-state={state.kind} className="min-w-0">
      <Panel.Header>
        <div>
          <Panel.Title id={titleId}>{WATCHLIST_TEXTS.chartTitle}</Panel.Title>
          <Panel.Description>{WATCHLIST_TEXTS.chartDescription}</Panel.Description>
        </div>
      </Panel.Header>
      <Panel.Body>
        <ChangeBarsBody state={state} series={series} />
      </Panel.Body>
    </Panel>
  );
}
