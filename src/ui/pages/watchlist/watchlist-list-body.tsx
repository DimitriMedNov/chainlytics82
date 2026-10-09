import { Info, SearchX, Star, TrendingDown } from "lucide-react";
import { WATCHLIST_TEXTS, hiddenNotice } from "@/application/watchlist-screen/texts";
import { StateAction } from "@/ui/pages/watchlist/state-action";
import type { FavoriteCelebration } from "@/ui/pages/watchlist/use-watchlist-row-feedback";
import type { WatchlistListPanelProps } from "@/ui/pages/watchlist/watchlist-list-panel";
import { WatchlistRowSkeleton } from "@/ui/pages/watchlist/watchlist-row";
import { WatchlistSections } from "@/ui/pages/watchlist/watchlist-sections";
import { WatchlistToolbar, WatchlistToolbarSkeleton } from "@/ui/pages/watchlist/watchlist-toolbar";
import { EmptyState, ErrorState, LoadingRegion, Panel } from "@/ui/shared";

const EMPTY_ICONS = { empty: Star, "outside-top": TrendingDown, "no-matches": SearchX } as const;

function skeletonKeys(count: number): string[] {
  return Array.from({ length: count }, (_, position) => `fila-${position}`);
}

export interface WatchlistListBodyProps extends WatchlistListPanelProps {
  celebration: FavoriteCelebration | null;
}

/** El contenido de la tarjeta de la lista según el estado: error, cargando, vacío o las secciones. */
export function WatchlistListBody({ screen, handlers, celebration }: WatchlistListBodyProps) {
  const { state, search, sort, sections, hiddenCount } = screen;

  switch (state.kind) {
    case "list-error":
    case "prices-error":
      return (
        <Panel data-slot="watchlist-list" data-state={state.kind}>
          <Panel.Body>
            <ErrorState
              title={state.title}
              message={state.message}
              onRetry={state.onRetry}
              isRetrying={state.isRetrying}
            />
          </Panel.Body>
        </Panel>
      );
    case "list-loading":
    case "prices-loading":
      return (
        <Panel data-slot="watchlist-list" data-state={state.kind}>
          <Panel.Body>
            <LoadingRegion label={WATCHLIST_TEXTS.loadingList} className="flex flex-col gap-5">
              <WatchlistToolbarSkeleton />
              <ul className="flex flex-col gap-2">
                {skeletonKeys(state.skeletonRows).map((key) => (
                  <WatchlistRowSkeleton key={key} />
                ))}
              </ul>
            </LoadingRegion>
          </Panel.Body>
        </Panel>
      );
    case "empty":
      return (
        <EmptyState
          icon={EMPTY_ICONS.empty}
          title={state.title}
          description={state.description}
          action={<StateAction state={state} />}
        />
      );
    case "outside-top":
    case "no-matches":
      return (
        <Panel data-slot="watchlist-list" data-state={state.kind}>
          <Panel.Body className="flex flex-col gap-5">
            <WatchlistToolbar search={search} sort={sort} showSort={state.kind === "no-matches"} />
            <EmptyState
              icon={EMPTY_ICONS[state.kind]}
              title={state.title}
              description={state.description}
              action={<StateAction state={state} />}
              size="sm"
              framed={false}
              // Alto reservado: al quedarse sin filas, lo de debajo se mueve menos.
              // En una columna (móvil y tableta) la gráfica va debajo: se reserva
              // más, para que no suba de golpe a la vista. En dos columnas no hace falta.
              className="min-h-112 justify-center lg:min-h-72"
            />
          </Panel.Body>
        </Panel>
      );
    case "ready":
      return (
        <Panel data-slot="watchlist-list" data-state={state.kind} className="overflow-clip">
          <Panel.Body className="flex flex-col gap-5">
            <WatchlistToolbar search={search} sort={sort} showSort />
            {hiddenCount > 0 ? (
              <p className="flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                {hiddenNotice(hiddenCount)}
              </p>
            ) : null}
            <WatchlistSections sections={sections} handlers={handlers} celebration={celebration} />
          </Panel.Body>
        </Panel>
      );
  }
}
