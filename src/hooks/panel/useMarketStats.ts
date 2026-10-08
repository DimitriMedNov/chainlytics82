import { useMemo } from "react";
import { buildMarketStats, type MarketStat } from "@/application/panel/presentation/marketStats";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import { resolveBlockStatus, type BlockStatus } from "@/domain/panel/blockStatus";
import { btcDominanceRing, marketFigures, type DominanceRing } from "@/domain/panel/marketFigures";
import { useGlobalMarket } from "@/hooks/market/useMarketData";

export interface MarketStatsState {
  /** Nunca "empty": las cifras son un único objeto, o llega o hay error. */
  status: Exclude<BlockStatus, "empty">;
  /** Las tres tarjetas, en orden. Vacío mientras no hay datos. */
  stats: MarketStat[];
  /** Dominancia de Bitcoin como proporción, para un anillo. null sin datos. */
  dominance: DominanceRing | null;
  errorTitle: string;
  /** Mensaje del fallo, ya en español. "" si no hay error. */
  errorMessage: string;
  retry: () => void;
  /** true mientras se vuelve a pedir (botón «Reintentando…»). */
  isRetrying: boolean;
}

/** Cifras globales del mercado. Se refrescan solas cada 5 minutos. */
export function useMarketStats(): MarketStatsState {
  const { data, isPending, isError, error, refetch, isFetching } = useGlobalMarket();

  const stats = useMemo(() => (data ? buildMarketStats(marketFigures(data)) : []), [data]);
  const dominance = useMemo(() => (data ? btcDominanceRing(data.btcDominance) : null), [data]);
  const status = resolveBlockStatus({ isPending, isError }, false);

  return {
    status: status === "empty" ? "success" : status,
    stats,
    dominance,
    errorTitle: PANEL_TEXTS.stats.errorTitle,
    errorMessage: error?.message ?? "",
    retry: () => void refetch(),
    isRetrying: isFetching,
  };
}
