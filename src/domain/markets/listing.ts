import type { Coin } from "../market/coin.ts";
import { DEFAULT_MARKET_FILTER, filterCoins, type MarketFilter } from "./filters.ts";
import { DEFAULT_MARKET_SORT, sortCoins, type MarketSortKey } from "./sorting.ts";

/** Lo que el usuario ha elegido en la tarjeta de filtros. */
export interface MarketCriteria {
  searchTerm: string;
  filter: MarketFilter;
  sortBy: MarketSortKey;
}

export const DEFAULT_MARKET_CRITERIA: MarketCriteria = {
  searchTerm: "",
  filter: DEFAULT_MARKET_FILTER,
  sortBy: DEFAULT_MARKET_SORT,
};

/** La lista que se pinta: buscar, filtrar y después ordenar. */
export function selectVisibleCoins(coins: Coin[] | undefined, criteria: MarketCriteria): Coin[] {
  if (!coins) return [];
  return sortCoins(filterCoins(coins, criteria.searchTerm, criteria.filter), criteria.sortBy);
}

/**
 * "Limpiar filtros": borra la búsqueda y el filtro.
 * Conservado: no restablece el orden. Inventario §9 nº 30.
 */
export function clearCriteria(criteria: MarketCriteria): MarketCriteria {
  return { ...criteria, searchTerm: "", filter: DEFAULT_MARKET_FILTER };
}

/** ¿Hay búsqueda o filtro puestos? (El orden no cuenta: no esconde monedas.) */
export function hasActiveCriteria(criteria: MarketCriteria): boolean {
  return criteria.searchTerm.trim() !== "" || criteria.filter !== DEFAULT_MARKET_FILTER;
}

/**
 * En qué estado está el listado:
 * - `error`: falló la carga (gana a todo, como en la pantalla anterior).
 * - `loading`: primera carga, aún sin datos.
 * - `empty-api`: la API respondió sin monedas.
 * - `empty-filters`: hay monedas pero ninguna pasa la búsqueda o el filtro.
 * - `ready`: hay filas que pintar.
 */
export type MarketListStatus = "error" | "loading" | "empty-api" | "empty-filters" | "ready";

export interface MarketListSnapshot {
  isError: boolean;
  isPending: boolean;
  totalCount: number;
  visibleCount: number;
}

export function resolveMarketListStatus(snapshot: MarketListSnapshot): MarketListStatus {
  if (snapshot.isError) return "error";
  if (snapshot.isPending) return "loading";
  if (snapshot.visibleCount > 0) return "ready";
  return snapshot.totalCount === 0 ? "empty-api" : "empty-filters";
}
