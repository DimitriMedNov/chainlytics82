import { useEffect, useMemo, useState } from "react";
import type { LabeledPricePoint } from "@/application/market/presentation/pricePointLabels";
import {
  DEFAULT_DETAIL_RANGE,
  priceSeriesStatus,
  summarizePriceSeries,
  type PriceSeriesStatus,
  type PriceSeriesSummary,
} from "@/domain/coin-detail/priceSeries";
import { RANGES, type RangeDays } from "@/domain/shared/range";
import { usePriceHistory } from "@/hooks/market/useMarketData";

const SIN_PUNTOS: LabeledPricePoint[] = [];

export interface CoinDetailChart {
  /** Rango elegido, en días. Por defecto 30. */
  days: RangeDays;
  setDays: (days: RangeDays) => void;
  /** Opciones del selector: 24 h, 7 d, 30 d, 90 d, 1 año. */
  ranges: typeof RANGES;
  /** Cuál de los 4 estados toca pintar. */
  status: PriceSeriesStatus;
  /** Precio en el tiempo, con `date` (eje) y `fullDate` (tooltip). `[]` si no hay. */
  points: LabeledPricePoint[];
  /** Mínimo, máximo, variación del periodo y límites del eje; `null` sin puntos. */
  summary: PriceSeriesSummary | null;
  /** Mensaje del fallo, ya en español; `""` si no hay. */
  errorMessage: string;
  /** `true` mientras se vuelve a pedir (para el botón de reintentar). */
  isRetrying: boolean;
  retry: () => void;
}

/**
 * Gráfica del modal de detalle: rango elegido y serie de precios con sus
 * estados. Sale de `CryptoDetailsModal.tsx:27-33` y `:79-88`.
 */
export function useCoinDetailChart(coinId: string | undefined, open: boolean): CoinDetailChart {
  const [days, setDays] = useState<RangeDays>(DEFAULT_DETAIL_RANGE);

  // Conservado: el histórico solo se pide con el modal abierto.
  const history = usePriceHistory(coinId, days, open);

  // Cada moneda se abre en el rango por defecto, no en el de la anterior.
  useEffect(() => {
    if (open) setDays(DEFAULT_DETAIL_RANGE);
  }, [open, coinId]);

  const points = history.data ?? SIN_PUNTOS;
  const summary = useMemo(() => summarizePriceSeries(points), [points]);
  const { refetch } = history;

  return {
    days,
    setDays,
    ranges: RANGES,
    status: priceSeriesStatus({
      isError: history.isError,
      isPending: history.isPending,
      pointCount: history.data?.length,
    }),
    points,
    summary,
    errorMessage: history.error?.message ?? "",
    isRetrying: history.isFetching,
    retry: () => void refetch(),
  };
}
