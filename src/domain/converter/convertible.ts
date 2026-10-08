import type { Coin } from "../market/coin.ts";
import type { FiatRate } from "../market/fiat.ts";

/** Una unidad convertible: cripto o fiat, siempre con su precio en dólares. */
export interface Convertible {
  code: string;
  name: string;
  /** Cuántos dólares vale 1 unidad. */
  usdPrice: number;
  change24h: number | null;
  kind: "cripto" | "fiat";
  image?: string;
}

/** Cuántas criptos (las mayores del mercado) entran en la lista del convertidor. */
export const CRYPTOS_IN_LIST = 30;

export function convertibleFromCoin(coin: Coin): Convertible {
  return {
    code: coin.symbol,
    name: coin.name,
    usdPrice: coin.price,
    change24h: coin.change24h,
    kind: "cripto",
    image: coin.image,
  };
}

export function convertibleFromFiat(rate: FiatRate): Convertible {
  return {
    code: rate.code,
    name: rate.name,
    usdPrice: rate.usdPerUnit,
    change24h: null,
    kind: "fiat",
  };
}

/**
 * Lista única para el convertidor: las criptos más grandes más las monedas
 * fiat. Todo se compara pasando por el dólar. Lo que aún no ha cargado cuenta
 * como lista vacía.
 */
// Conservado: dos criptos con el mismo símbolo dentro de las 30 darían dos
// opciones con el mismo `code` (inventario §9, punto 29).
export function buildConvertibles(
  coins: readonly Coin[] | undefined,
  rates: readonly FiatRate[] | undefined,
): Convertible[] {
  const cryptoItems = (coins ?? []).slice(0, CRYPTOS_IN_LIST).map(convertibleFromCoin);
  const fiatItems = (rates ?? []).map(convertibleFromFiat);
  return [...cryptoItems, ...fiatItems];
}

/** La primera opción con ese código, o `undefined` si no está en la lista. */
export function findConvertible(
  options: readonly Convertible[],
  code: string,
): Convertible | undefined {
  return options.find((option) => option.code === code);
}
