import type { Coin } from "../market/coin.ts";

/** Más de cinco líneas no se distinguen, y cada moneda es una petición. */
export const MAX_MONEDAS = 5;

/** Lo que se compara si la URL no dice nada. */
export const DEFAULT_COIN_IDS: readonly string[] = ["bitcoin", "ethereum"];

/**
 * Ids elegidos a partir del valor crudo de la URL (`bitcoin,ethereum`), o
 * `null` si el parámetro no está.
 */
export function parseSelection(raw: string | null): string[] {
  const ids = raw === null ? [...DEFAULT_COIN_IDS] : raw.split(",").filter(Boolean);
  return ids.slice(0, MAX_MONEDAS);
}

/**
 * Valor que se escribe en la URL, o `null` si hay que quitar el parámetro.
 * Conservado: con la lista vacía se quita el parámetro, y sin parámetro
 * `parseSelection` devuelve los valores por defecto; por eso quitar la última
 * moneda hace reaparecer bitcoin + ethereum (inventario §9 nº 2).
 */
export function serializeSelection(ids: string[]): string | null {
  return ids.length === 0 ? null : ids.join(",");
}

/**
 * Añade una moneda: sin duplicados y con tope. Devuelve `null` si no hay nada
 * que cambiar (id vacío o ya elegida).
 * Conservado: el tope se aplica sobre los ids de la URL, no sobre las monedas
 * que se ven; un id fuera del top 100 ocupa hueco aunque no se pinte, así que
 * con cinco ids añadir otra no tiene efecto (inventario §9 nº 28).
 */
export function addToSelection(ids: string[], coinId: string): string[] | null {
  if (coinId === "" || ids.includes(coinId)) return null;
  return [...ids, coinId].slice(0, MAX_MONEDAS);
}

export function removeFromSelection(ids: string[], coinId: string): string[] {
  return ids.filter((id) => id !== coinId);
}

/**
 * Las monedas elegidas que existen en el catálogo cargado, en el orden de la
 * selección. Las que no están (o si el catálogo aún no ha llegado) se omiten.
 */
export function resolveSelection(ids: string[], catalog: Coin[] | undefined): Coin[] {
  return ids.flatMap((id) => {
    const coin = catalog?.find((item) => item.id === id);
    return coin ? [coin] : [];
  });
}

/**
 * ¿Se ha llegado al máximo?
 * Conservado: cuenta las monedas que se ven, no los ids de la URL.
 */
export function isSelectionFull(selected: Coin[], max: number = MAX_MONEDAS): boolean {
  return selected.length >= max;
}

/** Monedas del catálogo que aún se pueden añadir. */
export function availableCoins(options: Coin[], selected: Coin[]): Coin[] {
  return options.filter((coin) => !selected.some((elegida) => elegida.id === coin.id));
}

/**
 * Color de serie (1..5, los tokens `--chart-1` a `--chart-5`) de la moneda que
 * ocupa esa posición (desde 0) en la selección.
 * Conservado: el color va por posición, así que quitar una moneda cambia el
 * color de las que venían detrás (inventario §9 nº 28).
 */
export function colorIndexAt(position: number): number {
  return (position % MAX_MONEDAS) + 1;
}

/** Color de serie de una moneda, o `null` si no está en la selección. */
export function colorIndexOf(selected: Coin[], coinId: string): number | null {
  const position = selected.findIndex((coin) => coin.id === coinId);
  return position === -1 ? null : colorIndexAt(position);
}
