import type { Coin } from "../market/coin.ts";

/** Sentido del cambio de precio, para elegir icono y color. */
export type Trend = "up" | "down";

/**
 * Sentido del cambio en 24 h.
 * Conservado: un cambio de exactamente 0 cuenta como subida (`>= 0`), igual
 * que en `CryptoPriceSection.tsx:11`.
 */
export function trend24h(coin: Pick<Coin, "change24h">): Trend {
  return coin.change24h >= 0 ? "up" : "down";
}

/** Recorta una proporción a 0–1 para poder pintarla como barra. */
function clampRatio(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Dónde cae el precio actual dentro del rango mínimo–máximo de 24 h. */
export interface DayRangePosition {
  low: number;
  high: number;
  price: number;
  /**
   * 0 = en el mínimo, 1 = en el máximo. `null` si el rango no se puede
   * pintar: máximo y mínimo iguales, invertidos o no numéricos.
   */
  ratio: number | null;
}

/**
 * Posición del precio actual entre el mínimo y el máximo de 24 h, para una
 * barra de rango. El precio puede llegar un instante por fuera del rango
 * (son dos datos de la API con distinta frescura): se recorta a 0–1.
 */
export function dayRangePosition(
  coin: Pick<Coin, "price" | "low24h" | "high24h">,
): DayRangePosition {
  const { price, low24h: low, high24h: high } = coin;
  const span = high - low;
  const drawable = Number.isFinite(span) && span > 0 && Number.isFinite(price);
  return { low, high, price, ratio: drawable ? clampRatio((price - low) / span) : null };
}

/** Capitalización de mercado frente a la totalmente diluida (FDV). */
export interface MarketCapVsFdv {
  marketCap: number;
  /** `null` cuando la API no la da: la interfaz enseña "No disponible". */
  fdv: number | null;
  /** Capitalización / FDV, recortado a 0–1. `null` sin FDV o con FDV 0. */
  ratio: number | null;
}

export function marketCapVsFdv(coin: Pick<Coin, "marketCap" | "fdv">): MarketCapVsFdv {
  const { marketCap, fdv } = coin;
  const known = fdv !== null && Number.isFinite(fdv) && fdv > 0 && Number.isFinite(marketCap);
  return { marketCap, fdv, ratio: known ? clampRatio(marketCap / fdv) : null };
}

/** Oferta circulante frente a la total. */
export interface SupplyShare {
  circulating: number;
  /** `null` cuando la API no la da. */
  total: number | null;
  /**
   * Circulante / total, recortado a 0–1. `null` si falta alguno de los dos:
   * total `null` o 0, o circulante 0 (que se enseña como "No disponible").
   */
  ratio: number | null;
}

export function supplyShare(coin: Pick<Coin, "circulatingSupply" | "totalSupply">): SupplyShare {
  const { circulatingSupply: circulating, totalSupply: total } = coin;
  const known =
    total !== null &&
    Number.isFinite(total) &&
    total > 0 &&
    Number.isFinite(circulating) &&
    circulating > 0;
  return { circulating, total, ratio: known ? clampRatio(circulating / total) : null };
}

/** Las cifras derivadas que enseña el modal de detalle de una moneda. */
export interface CoinDetailFigures {
  trend24h: Trend;
  /** `null` si la API no trae el cambio a 7 días. */
  change7d: number | null;
  /**
   * Distancia al máximo histórico, en %. Es el dato de la API tal cual
   * (`athChangePct`); no se recalcula con el precio actual.
   */
  athDistancePct: number;
  dayRange: DayRangePosition;
  marketCapVsFdv: MarketCapVsFdv;
  supply: SupplyShare;
}

export function coinDetailFigures(coin: Coin): CoinDetailFigures {
  return {
    trend24h: trend24h(coin),
    change7d: coin.change7d,
    athDistancePct: coin.athChangePct,
    dayRange: dayRangePosition(coin),
    marketCapVsFdv: marketCapVsFdv(coin),
    supply: supplyShare(coin),
  };
}
