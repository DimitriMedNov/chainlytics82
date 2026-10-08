import type { TrendKey } from "../../../domain/markets/charts.ts";
import { MARKET_FILTER_VALUES, type MarketFilter } from "../../../domain/markets/filters.ts";
import type { MarketListStatus } from "../../../domain/markets/listing.ts";
import { MARKET_SORT_KEYS, type MarketSortKey } from "../../../domain/markets/sorting.ts";

/** Textos de la pantalla de Mercados, tal como estaban en la interfaz anterior. */
export const MARKETS_TEXTS = {
  title: "Mercados",
  subtitle: "Las 100 criptomonedas con mayor capitalización, con precios en vivo",
  filtersTitle: "Filtros y búsqueda",
  searchLabel: "Buscar criptomoneda",
  searchPlaceholder: "Bitcoin, BTC…",
  filterLabel: "Mostrar",
  sortLabel: "Ordenar por",
  listTitleIdle: "Criptomonedas",
  errorTitle: "No se pudo cargar el mercado",
  emptyTitle: "Ninguna moneda coincide",
  emptyDescription: "Prueba con otro nombre o quita los filtros para ver el listado completo.",
  clearFilters: "Limpiar filtros",
  marketCapLabel: "Capitalización",
  volumeLabel: "Volumen 24 h",
  viewDetails: "Ver detalles",
} as const;

const FILTER_LABELS: Readonly<Record<MarketFilter, string>> = {
  all: "Todas las monedas",
  gainers: "Suben en 24 h",
  losers: "Bajan en 24 h",
};

const SORT_LABELS: Readonly<Record<MarketSortKey, string>> = {
  marketcap: "Capitalización",
  volume: "Volumen 24 h",
  change: "Cambio 24 h",
  price: "Precio",
  rank: "Ranking",
};

/** Opciones del desplegable "Mostrar", en su orden. */
export const MARKET_FILTERS: ReadonlyArray<{ value: MarketFilter; label: string }> =
  MARKET_FILTER_VALUES.map((value) => ({ value, label: FILTER_LABELS[value] }));

/** Opciones del desplegable "Ordenar por", en su orden. */
export const MARKET_SORTS: ReadonlyArray<{ value: MarketSortKey; label: string }> =
  MARKET_SORT_KEYS.map((value) => ({ value, label: SORT_LABELS[value] }));

/** Nombres de los trozos del reparto suben / bajan / sin cambio (gráfica nueva). */
export const TREND_LABELS: Readonly<Record<TrendKey, string>> = {
  up: "Suben",
  down: "Bajan",
  flat: "Sin cambio",
};

/**
 * Título de la lista: "{n} criptomonedas", o "Criptomonedas" mientras carga o
 * falla. Conservado: no hay singular ("1 criptomonedas").
 */
export function marketListTitle(status: MarketListStatus, visibleCount: number): string {
  if (status === "loading" || status === "error") return MARKETS_TEXTS.listTitleIdle;
  return `${visibleCount} criptomonedas`;
}

/** Texto solo para lectores de pantalla que completa "Ver detalles". */
export function viewDetailsSuffix(coinName: string): string {
  return ` de ${coinName}`;
}
