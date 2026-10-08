import type { WatchlistCoin } from "../../domain/watchlist/entries.ts";
import { CONVERTER_PATH } from "./texts.ts";

/** Texto de un aviso (toast). Lo lanza la interfaz. */
export interface Notice {
  title: string;
  description: string;
}

/**
 * Aviso al quitar una moneda. El nombre se busca en las monedas con precio;
 * si no está (fuera del top), se usa el símbolo tal cual.
 */
// Conservado: se quita sin confirmación ni deshacer, y el aviso sale al pulsar,
// sin esperar a que se guarde (inventario §9, puntos 5 y 25).
export function removedNotice(coins: WatchlistCoin[], symbol: string): Notice {
  const item = coins.find((coin) => coin.symbol === symbol);
  return {
    title: "Eliminada del watchlist",
    description: `${item?.name ?? symbol} ya no está en tu lista`,
  };
}

/** Adónde ir y qué avisar al pulsar «Convertir». */
export interface ConvertIntent {
  to: string;
  notice: Notice;
}

// Conservado: lleva al convertidor SIN preseleccionar la moneda, aunque el
// aviso la nombre (inventario §9, punto 24).
export function convertIntent(item: Pick<WatchlistCoin, "name">): ConvertIntent {
  return {
    to: CONVERTER_PATH,
    notice: {
      title: "Vamos al convertidor",
      description: `Ahí puedes convertir ${item.name}`,
    },
  };
}
