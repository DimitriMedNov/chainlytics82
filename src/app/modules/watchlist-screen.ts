import type { BaseDeps } from "@/app/base";

/**
 * Watchlist (/watchlist): orden (nombre, precio, cambio), búsqueda y reparto en favoritas / todas.
 *
 * Se queda vacío a propósito: esta pantalla no necesita ningún adaptador ni
 * puerto propio. Los datos le llegan de lo compartido (`base.watchlist` y
 * `base.market`, a través de `useWatchlist()` y `useMarkets()`), y lo suyo es
 * cálculo puro sobre lo ya cargado, que no hay que montar:
 * `src/domain/watchlist-screen/` y `src/application/watchlist-screen/`,
 * reunidos en `useWatchlistScreen` (`src/hooks/watchlist-screen/`).
 *
 * Si algún día la pantalla necesita algo de fuera (p. ej. precios de monedas
 * fuera del top 100), su caso de uso se conecta aquí y llega a los hooks con
 * `useDeps().watchlistScreen`.
 */
export function createWatchlistScreenModule(_base: BaseDeps) {
  return {};
}
