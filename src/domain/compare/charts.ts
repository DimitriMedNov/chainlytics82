import type { Coin } from "../market/coin.ts";
import { colorIndexAt, colorIndexOf } from "./selection.ts";
import type { ComparisonRow, SeriesResult } from "./series.ts";

/** Un punto de una línea: instante y variación acumulada en %. */
export interface ChangePoint {
  timestamp: number;
  changePct: number;
}

/** Una línea de la gráfica de comparación. */
export interface LineSeries {
  coinId: string;
  symbol: string;
  name: string;
  /** 1..5: token `--chart-N`. */
  colorIndex: number;
  points: ChangePoint[];
}

/**
 * Una línea por moneda elegida, en el orden de la selección. Una moneda sin
 * datos (o sin precio base válido) queda con `points` vacío, como antes
 * quedaba su línea sin dibujar.
 */
export function toLineSeries(rows: ComparisonRow[], selected: Coin[]): LineSeries[] {
  return selected.map((coin, position) => ({
    coinId: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    colorIndex: colorIndexAt(position),
    points: rows.flatMap((row) => {
      const changePct = row.changes[coin.id];
      return typeof changePct === "number" ? [{ timestamp: row.timestamp, changePct }] : [];
    }),
  }));
}

/** Una línea del tooltip: una moneda y su % en el instante señalado. */
export interface TooltipEntry {
  coinId: string;
  symbol: string;
  changePct: number;
  colorIndex: number | null;
}

/**
 * Lo que enseña el tooltip en una fila: solo las monedas elegidas que tienen
 * valor en ese instante, de mejor a peor, que es como se lee un gráfico de
 * comparación.
 */
export function tooltipEntries(row: ComparisonRow, selected: Coin[]): TooltipEntry[] {
  return selected
    .flatMap((coin, position) => {
      const changePct = row.changes[coin.id];
      return typeof changePct === "number"
        ? [{ coinId: coin.id, symbol: coin.symbol, changePct, colorIndex: colorIndexAt(position) }]
        : [];
    })
    .sort((a, b) => b.changePct - a.changePct);
}

/** Un puesto de la clasificación "Quién lo ha hecho mejor". */
export interface RankingEntry {
  /** Puesto, desde 1 (el mejor). */
  position: number;
  coinId: string;
  symbol: string;
  /** Nombre de la moneda; si no está en la selección, su símbolo. */
  name: string;
  /** Imagen de la moneda, o `null` si no está en la selección. */
  image: string | null;
  /** 1..5, el mismo color que su línea. `null` si no está en la selección. */
  colorIndex: number | null;
  firstPrice: number;
  lastPrice: number;
  changePct: number;
  /** `true` si no ha bajado (0 % cuenta como subida): verde; si no, naranja. */
  rises: boolean;
}

/** Clasificación en el orden en que llegan los resultados (ya de mejor a peor). */
export function toRanking(results: SeriesResult[], selected: Coin[]): RankingEntry[] {
  return results.map((result, index) => {
    const coin = selected.find((item) => item.id === result.coinId);
    return {
      position: index + 1,
      coinId: result.coinId,
      symbol: result.symbol,
      name: coin?.name ?? result.symbol,
      image: coin?.image ?? null,
      colorIndex: colorIndexOf(selected, result.coinId),
      firstPrice: result.firstPrice,
      lastPrice: result.lastPrice,
      changePct: result.changePct,
      rises: result.changePct >= 0,
    };
  });
}

/** Una barra de la clasificación: variación % del periodo de una moneda. */
export interface RankingBar {
  coinId: string;
  label: string;
  value: number;
  colorIndex: number | null;
  rises: boolean;
}

/** Serie para una gráfica de barras de la clasificación, de mejor a peor. */
export function toRankingBars(ranking: RankingEntry[]): RankingBar[] {
  return ranking.map((entry) => ({
    coinId: entry.coinId,
    label: entry.symbol,
    value: entry.changePct,
    colorIndex: entry.colorIndex,
    rises: entry.rises,
  }));
}
