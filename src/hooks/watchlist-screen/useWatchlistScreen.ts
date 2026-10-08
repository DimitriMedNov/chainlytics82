import { useCallback, useMemo, useState } from "react";
import {
  convertIntent,
  removedNotice,
  type ConvertIntent,
  type Notice,
} from "@/application/watchlist-screen/actions";
import { buildWatchlistView } from "@/application/watchlist-screen/buildView";
import {
  favoritesTitle,
  othersTitle,
  WATCHLIST_TEXTS,
} from "@/application/watchlist-screen/texts";
import type { WatchlistCoin } from "@/domain/watchlist/entries";
import { followedCountLabel } from "@/domain/watchlist-screen/counter";
import { resolveWatchlistStatus } from "@/domain/watchlist-screen/status";
import { useMarkets } from "@/hooks/market/useMarketData";
import { useWatchlist } from "@/hooks/watchlist/useWatchlist";
import { toScreenState } from "@/hooks/watchlist-screen/screenState";
import { useWatchlistDetail } from "@/hooks/watchlist-screen/useWatchlistDetail";
import { useWatchlistSort } from "@/hooks/watchlist-screen/useWatchlistSort";

/**
 * Todo lo que la pantalla /watchlist necesita para pintarse: cabecera, estado,
 * búsqueda, orden, secciones, gráfica y acciones. Sustituye a la lógica de
 * `pages/Watchlist.tsx` + `useWatchlistView` + `useWatchlistSorting`.
 */
export function useWatchlistScreen() {
  const watchlist = useWatchlist();
  const markets = useMarkets();
  const [searchTerm, setSearchTerm] = useState("");
  const sort = useWatchlistSort();
  const detail = useWatchlistDetail();

  const { entries, remove: removeEntry, toggleFavorite } = watchlist;
  const { refetch: refetchPrices } = markets;

  const view = useMemo(
    () => buildWatchlistView(entries, markets.data, searchTerm, sort.state),
    [entries, markets.data, searchTerm, sort.state],
  );
  const { coins } = view;

  const clearSearch = useCallback(() => setSearchTerm(""), []);
  const retryPrices = useCallback(() => void refetchPrices(), [refetchPrices]);

  const kind = resolveWatchlistStatus({
    listError: watchlist.isError,
    listPending: watchlist.isPending,
    entryCount: entries.length,
    pricesError: markets.isError,
    pricesPending: markets.isPending,
    coinCount: coins.length,
    visibleCount: view.sortedItems.length,
  });

  const state = toScreenState(kind, {
    list: {
      errorMessage: watchlist.errorMessage,
      refetch: watchlist.refetch,
      isRefetching: watchlist.isRefetching,
    },
    prices: {
      errorMessage: markets.error?.message ?? "",
      refetch: retryPrices,
      isRefetching: markets.isFetching,
    },
    clearSearch,
  });

  /** Quita la moneda y devuelve el aviso que hay que enseñar. */
  const remove = useCallback(
    (symbol: string): Notice => {
      const notice = removedNotice(coins, symbol);
      removeEntry(symbol);
      return notice;
    },
    [coins, removeEntry],
  );

  /** No navega: devuelve adónde ir y el aviso. */
  const convert = useCallback((item: WatchlistCoin): ConvertIntent => convertIntent(item), []);

  return {
    header: {
      title: WATCHLIST_TEXTS.title,
      count: entries.length,
      countLabel: followedCountLabel(entries.length),
      isSynced: watchlist.isSynced,
      /** El botón «Ordenar por nombre» solo sale si hay entradas guardadas. */
      showSortByName: entries.length > 0,
    },
    state,
    search: { term: searchTerm, setTerm: setSearchTerm, clear: clearSearch },
    sort,
    sections: {
      favorites: { title: favoritesTitle(view.favorites.length), items: view.favorites },
      others: { title: othersTitle(view.others.length), items: view.others },
    },
    coins,
    sortedItems: view.sortedItems,
    hiddenCount: view.hiddenCount,
    chartSeries: view.chartSeries,
    /** true mientras se vuelven a pedir los precios (cada 60 s o al reintentar). */
    isRefreshingPrices: markets.isFetching,
    actions: { toggleFavorite, remove, convert, openDetail: detail.open },
    detail,
    isSaving: watchlist.isSaving,
    saveErrorMessage: watchlist.saveErrorMessage,
    clearSaveError: watchlist.clearSaveError,
  };
}

export type WatchlistScreen = ReturnType<typeof useWatchlistScreen>;
