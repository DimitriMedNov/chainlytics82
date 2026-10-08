import type { WatchlistCoinRef } from "../../domain/watchlist/entries.ts";

/**
 * Lo que el modal de detalle necesita de la watchlist para alternar el
 * seguimiento. Lo cumple `useWatchlist()` (`src/hooks/watchlist/`), con o sin
 * sesión: el caso de uso no sabe dónde se guarda.
 */
export interface WatchlistTogglePort {
  has(symbol: string): boolean;
  add(coin: WatchlistCoinRef): void;
  remove(symbol: string): void;
}

/** Un aviso (toast) para enseñar tal cual: quien llama elige el componente. */
export interface Notice {
  title: string;
  description: string;
}
