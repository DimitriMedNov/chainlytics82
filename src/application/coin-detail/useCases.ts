import type { Coin } from "../../domain/market/coin.ts";
import type { Notice, WatchlistTogglePort } from "./ports.ts";

/** La moneda del modal: lo justo para seguirla y nombrarla en el aviso. */
export type WatchlistToggleCoin = Pick<Coin, "id" | "symbol" | "name">;

export interface WatchlistToggleOutcome {
  action: "added" | "removed";
  notice: Notice;
}

/** Aviso al empezar a seguir (`CryptoDetailsModal.tsx:48-51`). */
export function addedNotice(coinName: string): Notice {
  return { title: "Añadido al watchlist", description: `${coinName} ya está en tu lista` };
}

/** Aviso al dejar de seguir (`CryptoDetailsModal.tsx:41-44`). */
export function removedNotice(coinName: string): Notice {
  return { title: "Eliminado del watchlist", description: `${coinName} ya no está en tu lista` };
}

/**
 * Alternar seguimiento: si la moneda ya está en la watchlist (por símbolo) la
 * quita; si no, la añade. Devuelve el aviso que debe enseñar la interfaz.
 *
 * Conservado: el aviso de éxito se devuelve en el acto, sin esperar a que el
 * cambio se guarde ni saber si falló (inventario §9 nº 5). `has()` compara
 * por símbolo, no por id (§9 nº 4).
 */
export function toggleCoinWatchlist(
  watchlist: WatchlistTogglePort,
  coin: WatchlistToggleCoin,
): WatchlistToggleOutcome {
  if (watchlist.has(coin.symbol)) {
    watchlist.remove(coin.symbol);
    return { action: "removed", notice: removedNotice(coin.name) };
  }
  watchlist.add(coin);
  return { action: "added", notice: addedNotice(coin.name) };
}

/** Ruta del convertidor. */
export const CONVERTER_ROUTE = "/converter";

export interface ConvertOutcome {
  /** A dónde navega la interfaz, después de cerrar el modal. */
  route: string;
  /** Aviso que enseñar; `null` = ninguno. */
  notice: Notice | null;
}

/**
 * Acción «Convertir» del modal (`CryptoDetailsModal.tsx:54-57`): la interfaz
 * cierra el modal y navega a `route`.
 *
 * Conservado: no preselecciona la moneda en el convertidor (la ruta no lleva
 * parámetros; inventario §9 nº 24). Conservado: desde el modal no sale ningún
 * aviso; el de "Vamos al convertidor" es de la página Watchlist, no de aquí.
 */
export function convertFromDetail(): ConvertOutcome {
  return { route: CONVERTER_ROUTE, notice: null };
}
