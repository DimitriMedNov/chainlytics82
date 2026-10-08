/** En qué situación está la pantalla. Solo una a la vez. */
export type WatchlistStatusKind =
  | "list-error" // no se pudo leer la lista (solo con sesión)
  | "list-loading" // leyendo la lista (solo con sesión)
  | "empty" // no sigues ninguna moneda
  | "prices-error" // hay lista, pero fallaron los precios
  | "prices-loading" // hay lista, cargando precios por primera vez
  | "outside-top" // hay lista y precios, pero ninguna moneda está en el top cargado
  | "no-matches" // la búsqueda no deja ninguna
  | "ready";

export interface WatchlistStatusInput {
  listError: boolean;
  listPending: boolean;
  /** Entradas guardadas. */
  entryCount: number;
  pricesError: boolean;
  pricesPending: boolean;
  /** Entradas que sí cruzan con el mercado cargado (antes de buscar). */
  coinCount: number;
  /** Las que quedan tras la búsqueda. */
  visibleCount: number;
}

/**
 * Decide el estado en el mismo orden de prioridad que la página original
 * (`pages/Watchlist.tsx:66-99`), con un caso más: `outside-top`.
 *
 * `outside-top` es un estado que faltaba: antes caía en `no-matches`
 * («Ninguna coincidencia / Limpiar búsqueda») aunque la búsqueda estuviera
 * vacía. Los datos son los mismos; solo se nombra el caso.
 */
export function resolveWatchlistStatus(input: WatchlistStatusInput): WatchlistStatusKind {
  if (input.listError) return "list-error";
  if (input.listPending) return "list-loading";
  if (input.entryCount === 0) return "empty";
  if (input.pricesError) return "prices-error";
  if (input.pricesPending) return "prices-loading";
  if (input.coinCount === 0) return "outside-top";
  if (input.visibleCount === 0) return "no-matches";
  return "ready";
}
