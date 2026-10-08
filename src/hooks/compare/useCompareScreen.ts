import { useMemo, useState } from "react";
import {
  labelComparisonRows,
  type LabeledComparisonRow,
} from "@/application/compare/presentation/labels";
import {
  toLineSeries,
  toRanking,
  toRankingBars,
  type LineSeries,
  type RankingBar,
  type RankingEntry,
} from "@/domain/compare/charts";
import {
  availableCoins,
  colorIndexAt,
  isSelectionFull,
  MAX_MONEDAS,
} from "@/domain/compare/selection";
import {
  chartStatus,
  pickerStatus,
  rankingStatus,
  type ChartStatus,
  type PickerStatus,
  type RankingStatus,
} from "@/domain/compare/status";
import type { Coin } from "@/domain/market/coin";
import type { RangeDays } from "@/domain/shared/range";
import { useCompareSelection } from "@/hooks/compare/useCompareSelection";
import { useComparison } from "@/hooks/compare/useComparison";
import { useMarkets } from "@/hooks/market/useMarketData";

/** Rango con el que abre la pantalla. Es estado local: no va en la URL. */
export const DEFAULT_COMPARE_DAYS: RangeDays = 30;

/** Una moneda elegida con el color de su línea (1..5, token `--chart-N`). */
export interface SelectedCoin {
  coin: Coin;
  colorIndex: number;
}

export interface CompareScreen {
  days: RangeDays;
  setDays: (days: RangeDays) => void;
  picker: {
    status: PickerStatus;
    errorMessage: string;
    retry: () => void;
    isRetrying: boolean;
    selected: SelectedCoin[];
    /** Monedas del top 100 que aún se pueden añadir. */
    available: Coin[];
    max: number;
    isFull: boolean;
    add: (coinId: string) => void;
    remove: (coinId: string) => void;
  };
  chart: {
    status: ChartStatus;
    errorMessage: string;
    retry: () => void;
    isRetrying: boolean;
    /** Una fila por instante común, con `date` y `fullDate` puestas. */
    rows: LabeledComparisonRow[];
    /** Una línea por moneda elegida. */
    series: LineSeries[];
    /** Monedas elegidas, para `tooltipEntries(row, coins)`. */
    coins: Coin[];
  };
  ranking: {
    status: RankingStatus;
    errorMessage: string;
    retry: () => void;
    isRetrying: boolean;
    entries: RankingEntry[];
    bars: RankingBar[];
  };
}

/** Todo lo que la pantalla Comparar necesita para pintar sus tres bloques. */
export function useCompareScreen(): CompareScreen {
  const [days, setDays] = useState<RangeDays>(DEFAULT_COMPARE_DAYS);
  const markets = useMarkets();
  const { selected, add, remove } = useCompareSelection(markets.data);
  const comparison = useComparison(selected, days);
  const { rows, results, isError, isPending } = comparison;

  const chart = useMemo(
    () => ({
      rows: labelComparisonRows(rows, days),
      series: toLineSeries(rows, selected),
    }),
    [rows, days, selected],
  );
  const ranking = useMemo(() => {
    const entries = toRanking(results, selected);
    return { entries, bars: toRankingBars(entries) };
  }, [results, selected]);

  const selectedCount = selected.length;
  const history = {
    errorMessage: comparison.errorMessage,
    retry: comparison.refetch,
    isRetrying: comparison.isFetching,
  };

  return {
    days,
    setDays,
    picker: {
      status: pickerStatus({ isError: markets.isError, isPending: markets.isPending, selectedCount }),
      errorMessage: markets.error?.message ?? "",
      retry: () => void markets.refetch(),
      isRetrying: markets.isFetching,
      selected: selected.map((coin, position) => ({ coin, colorIndex: colorIndexAt(position) })),
      available: availableCoins(markets.data ?? [], selected),
      max: MAX_MONEDAS,
      isFull: isSelectionFull(selected, MAX_MONEDAS),
      add,
      remove,
    },
    chart: {
      status: chartStatus({ selectedCount, isError, isPending, rowCount: rows.length }),
      ...history,
      ...chart,
      coins: selected,
    },
    ranking: {
      status: rankingStatus({ resultCount: results.length, selectedCount, isError, isPending }),
      ...history,
      ...ranking,
    },
  };
}
