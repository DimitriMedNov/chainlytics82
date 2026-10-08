import { DOMINANCE_DECIMALS, type MarketFigures } from "../../../domain/panel/marketFigures.ts";
import { isRising } from "../../../domain/panel/topCoins.ts";
import { formatCompact, formatPercent } from "../../shared/presentation/format.ts";
import { PANEL_TEXTS } from "./texts.ts";

/** Cambio en 24 h de una cifra, listo para pintar. */
export interface StatChange {
  /** En %, sin formato. */
  pct: number;
  /** Con signo y sufijo: «+2.45 % (24 h)». */
  text: string;
  /** true: flecha arriba y color de subida. false: flecha abajo y color de bajada. */
  rising: boolean;
}

/** Una de las tres tarjetas de cifras del Panel. */
export interface MarketStat {
  key: "cap" | "volumen" | "dominancia";
  label: string;
  /** La cifra ya con formato. */
  value: string;
  /** La cifra sin formato, por si se anima o se grafica. */
  raw: number;
  /** Solo la capitalización lo trae. */
  change?: StatChange;
}

/** Claves de las tres tarjetas, para dar forma al skeleton. */
export const MARKET_STAT_KEYS = ["cap", "volumen", "dominancia"] as const;

/**
 * Conservado: la dominancia sale con punto decimal («54.3 %») mientras el
 * resto de cifras usa coma (inventario §9 nº 31).
 */
export function formatDominance(btcDominancePct: number): string {
  return `${btcDominancePct.toFixed(DOMINANCE_DECIMALS)} %`;
}

export function formatStatChange(pct: number): StatChange {
  return {
    pct,
    text: `${formatPercent(pct)} ${PANEL_TEXTS.stats.changeSuffix}`,
    rising: isRising(pct),
  };
}

/** Las tres cifras del Panel, en el orden en que se enseñan. */
export function buildMarketStats(figures: MarketFigures): MarketStat[] {
  return [
    {
      key: "cap",
      label: PANEL_TEXTS.stats.marketCap,
      value: formatCompact(figures.totalMarketCap),
      raw: figures.totalMarketCap,
      change: formatStatChange(figures.marketCapChange24hPct),
    },
    {
      key: "volumen",
      label: PANEL_TEXTS.stats.volume,
      value: formatCompact(figures.totalVolume24h),
      raw: figures.totalVolume24h,
    },
    {
      key: "dominancia",
      label: PANEL_TEXTS.stats.dominance,
      value: formatDominance(figures.btcDominance),
      raw: figures.btcDominance,
    },
  ];
}
