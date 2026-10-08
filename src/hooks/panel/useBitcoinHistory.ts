import { useMemo, useState } from "react";
import type { LabeledPricePoint } from "@/application/market/presentation/pricePointLabels";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import {
  BITCOIN_ID,
  DEFAULT_BITCOIN_RANGE,
  isEmptySeries,
  priceAreaSeries,
  type AxisDomain,
} from "@/domain/panel/bitcoinChart";
import { resolveBlockStatus, type BlockStatus } from "@/domain/panel/blockStatus";
import { RANGES, type RangeDays } from "@/domain/shared/range";
import { usePriceHistory } from "@/hooks/market/useMarketData";

const NO_POINTS: LabeledPricePoint[] = [];

export interface BitcoinHistoryState {
  /** "empty" es nuevo: la serie llegó sin puntos. */
  status: BlockStatus;
  /** Rango elegido, en días. Arranca en 90. */
  days: RangeDays;
  setDays: (days: RangeDays) => void;
  /** Los cinco rangos del selector, con su etiqueta. */
  ranges: typeof RANGES;
  /** Puntos de la serie: `{ timestamp, date, fullDate, price }`. */
  points: readonly LabeledPricePoint[];
  /** Dominio del eje Y: `[mín × 0,98, máx × 1,02]`. null sin puntos. */
  yDomain: AxisDomain | null;
  errorTitle: string;
  /** Mensaje del fallo, ya en español. "" si no hay error. */
  errorMessage: string;
  /** Vuelve a pedir. Sirve para el error y para el vacío. */
  retry: () => void;
  isRetrying: boolean;
}

/**
 * Histórico del precio de Bitcoin para la gráfica del Panel. Al cambiar de
 * rango vuelve a "loading" hasta que llega la serie nueva (salvo que ya
 * estuviera en caché).
 */
export function useBitcoinHistory(): BitcoinHistoryState {
  const [days, setDays] = useState<RangeDays>(DEFAULT_BITCOIN_RANGE);
  const { data, isPending, isError, error, refetch, isFetching } = usePriceHistory(BITCOIN_ID, days);

  const series = useMemo(() => priceAreaSeries(data ?? NO_POINTS), [data]);

  return {
    status: resolveBlockStatus({ isPending, isError }, isEmptySeries(series.points)),
    days,
    setDays,
    ranges: RANGES,
    points: series.points,
    yDomain: series.yDomain,
    errorTitle: PANEL_TEXTS.bitcoin.errorTitle,
    errorMessage: error?.message ?? "",
    retry: () => void refetch(),
    isRetrying: isFetching,
  };
}
