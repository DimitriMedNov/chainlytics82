import type { GlobalMarket } from "../market/coin.ts";

/** Decimales con los que se enseña la dominancia de Bitcoin. */
export const DOMINANCE_DECIMALS = 1;

/** Cifras de mercado que enseña el Panel, aún sin formato. */
export interface MarketFigures {
  /** Capitalización total del mercado, en USD. */
  totalMarketCap: number;
  /** Cambio de la capitalización en 24 h, en %. */
  marketCapChange24hPct: number;
  /** Volumen negociado en 24 h, en USD. */
  totalVolume24h: number;
  /** Dominancia de Bitcoin, en % (0 a 100). */
  btcDominance: number;
}

export function marketFigures(global: GlobalMarket): MarketFigures {
  return {
    totalMarketCap: global.totalMarketCap,
    marketCapChange24hPct: global.marketCapChange24hPct,
    totalVolume24h: global.totalVolume24h,
    btcDominance: global.btcDominance,
  };
}

/** Dominancia de Bitcoin como proporción, para un anillo. */
export interface DominanceRing {
  /** Dominancia en %, tal como llega (0 a 100). */
  percent: number;
  /** Parte de Bitcoin, de 0 a 1. */
  share: number;
  /** El resto del mercado, de 0 a 1. `share + rest` es 1. */
  rest: number;
}

/**
 * Proporción de Bitcoin sobre el total. Se acota a 0..1 para que un dato
 * raro de la API no dibuje un anillo imposible; `percent` no se toca.
 */
export function btcDominanceRing(btcDominancePct: number): DominanceRing {
  const raw = btcDominancePct / 100;
  const share = Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 0;
  return { percent: btcDominancePct, share, rest: 1 - share };
}
