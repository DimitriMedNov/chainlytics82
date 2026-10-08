import { MARKETS_PATH, WATCHLIST_TEXTS as T } from "@/application/watchlist-screen/texts";
import type { WatchlistStatusKind } from "@/domain/watchlist-screen/status";

/** Un error con su botón de reintentar. */
export interface ErrorScreenState {
  kind: "list-error" | "prices-error";
  title: string;
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}

/** Cargando: `skeletonRows` son los bloques que pintaba la pantalla anterior. */
export interface LoadingScreenState {
  kind: "list-loading" | "prices-loading";
  skeletonRows: number;
}

/** Vacío cuya salida es ir a otra ruta (`actionTo`): navega la interfaz. */
export interface NavigateEmptyScreenState {
  kind: "empty" | "outside-top";
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}

/** Vacío por búsqueda: la salida es `onAction` (limpia la búsqueda). */
export interface NoMatchesScreenState {
  kind: "no-matches";
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export type WatchlistScreenState =
  | ErrorScreenState
  | LoadingScreenState
  | NavigateEmptyScreenState
  | NoMatchesScreenState
  | { kind: "ready" };

export interface ScreenStateSources {
  list: { errorMessage: string; refetch: () => void; isRefetching: boolean };
  prices: { errorMessage: string; refetch: () => void; isRefetching: boolean };
  clearSearch: () => void;
}

/** Viste cada estado con sus textos exactos y su acción. */
export function toScreenState(
  kind: WatchlistStatusKind,
  sources: ScreenStateSources,
): WatchlistScreenState {
  const { list, prices, clearSearch } = sources;
  switch (kind) {
    case "list-error":
      return {
        kind,
        title: T.listErrorTitle,
        message: list.errorMessage,
        onRetry: list.refetch,
        isRetrying: list.isRefetching,
      };
    case "prices-error":
      return {
        kind,
        title: T.pricesErrorTitle,
        message: prices.errorMessage,
        onRetry: prices.refetch,
        isRetrying: prices.isRefetching,
      };
    case "list-loading":
      return { kind, skeletonRows: 3 };
    case "prices-loading":
      return { kind, skeletonRows: 4 };
    case "empty":
      return {
        kind,
        title: T.emptyTitle,
        description: T.emptyDescription,
        actionLabel: T.emptyAction,
        actionTo: MARKETS_PATH,
      };
    case "outside-top":
      return {
        kind,
        title: T.outsideTopTitle,
        description: T.outsideTopDescription,
        actionLabel: T.outsideTopAction,
        actionTo: MARKETS_PATH,
      };
    case "no-matches":
      return {
        kind,
        title: T.noMatchesTitle,
        description: T.noMatchesDescription,
        actionLabel: T.noMatchesAction,
        onAction: clearSearch,
      };
    case "ready":
      return { kind };
  }
}
