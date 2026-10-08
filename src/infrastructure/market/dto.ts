/**
 * Lo que viaja por HTTP desde CoinGecko (DTO). No nos fiamos de su forma: cada
 * campo se lee con `num`/`str` y, si no es lo esperado, se usa un valor de
 * relleno. Estos tipos no salen de `infrastructure`: los mappers los
 * convierten a tipos de dominio.
 */

/** Fila de `/coins/markets`, en snake_case. */
export type CoinMarketDto = Record<string, unknown>;

/** Fila de `coins` en `/search`. */
export type CoinSearchDto = Record<string, unknown>;

/** Cada tasa de `/exchange_rates`, respecto a 1 BTC. */
export interface ExchangeRateDto {
  value?: unknown;
}

/** Lee un número de un objeto sin tipar; devuelve `fallback` si no lo es. */
export function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** Igual que `num`, pero conserva el null cuando CoinGecko no tiene el dato. */
export function numOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
