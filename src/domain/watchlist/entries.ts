import type { Coin } from "../market/coin.ts";

/** Lo único que persistimos. El precio siempre viene en vivo de la API. */
export interface WatchlistEntry {
  id: string;
  symbol: string;
  isFavorite: boolean;
}

/** Una entrada ya cruzada con los datos de mercado actuales. */
export interface WatchlistCoin extends Coin {
  isFavorite: boolean;
}

/** Lo que hace falta de una moneda para seguirla. */
export type WatchlistCoinRef = Pick<Coin, "id" | "symbol">;

// Conservado: no se comprueba que `id` sea texto; una entrada guardada sin id
// pasa la validación igual que antes.
export function isWatchlistEntry(value: unknown): value is WatchlistEntry {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.symbol === "string" && typeof item.isFavorite === "boolean";
}

/** Lee lo guardado con el formato actual, descartando lo que no sea una entrada. */
export function parseStoredWatchlist(raw: unknown): WatchlistEntry[] {
  return Array.isArray(raw) ? raw.filter(isWatchlistEntry) : [];
}

/** Convierte el formato viejo ({id: number, price, change}) al nuevo. */
export function migrateLegacyWatchlist(raw: unknown): WatchlistEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const old = item as Record<string, unknown>;
    if (typeof old.symbol !== "string") return [];
    return [
      {
        id: typeof old.coinId === "string" ? old.coinId : "",
        symbol: old.symbol.toUpperCase(),
        isFavorite: old.isFavorite === true,
      },
    ];
  });
}

// Conservado: se compara por símbolo, no por id. Dos monedas con el mismo
// símbolo cuentan como la misma (inventario §9, punto 4).
export function hasSymbol(entries: WatchlistEntry[], symbol: string): boolean {
  return entries.some((entry) => entry.symbol === symbol.toUpperCase());
}

/** Añade la moneda si su símbolo no estaba ya. Devuelve la misma lista si no cambia. */
export function addEntry(current: WatchlistEntry[], coin: WatchlistCoinRef): WatchlistEntry[] {
  const symbol = coin.symbol.toUpperCase();
  if (current.some((entry) => entry.symbol === symbol)) return current;
  return [...current, { id: coin.id, symbol, isFavorite: false }];
}

export function removeEntry(current: WatchlistEntry[], symbol: string): WatchlistEntry[] {
  return current.filter((entry) => entry.symbol !== symbol.toUpperCase());
}

export function setEntryFavorite(
  current: WatchlistEntry[],
  symbol: string,
  isFavorite: boolean,
): WatchlistEntry[] {
  return current.map((entry) =>
    entry.symbol === symbol.toUpperCase() ? { ...entry, isFavorite } : entry,
  );
}

/** El valor de favorito que toca al alternar: lo contrario del actual. */
export function nextFavorite(entries: WatchlistEntry[], symbol: string): boolean {
  const current = entries.find((entry) => entry.symbol === symbol.toUpperCase());
  return !(current?.isFavorite ?? false);
}

/**
 * Id de moneda con el que se sube una entrada a la cuenta. Las entradas
 * migradas del formato viejo no tienen id: se usa el símbolo en minúsculas.
 */
export function entryCoinId(entry: WatchlistEntry): string {
  return entry.id === "" ? entry.symbol.toLowerCase() : entry.id;
}

/** Cruza las entradas guardadas con los precios en vivo. */
// Conservado: lo que no esté en `coins` (el top cargado) se descarta en
// silencio (inventario §9, punto 3).
export function joinWithMarket(
  entries: WatchlistEntry[],
  coins: Coin[] | undefined,
): WatchlistCoin[] {
  if (!coins) return [];
  return entries.flatMap((entry) => {
    const coin = coins.find((item) => item.symbol === entry.symbol || item.id === entry.id);
    return coin ? [{ ...coin, isFavorite: entry.isFavorite }] : [];
  });
}
