import type { Position } from "../portfolio/types.ts";
import type { UsdMaybe } from "../shared/money.ts";

/** Peso de una posición sobre el valor total, en %. 0 si el total no es positivo. */
export function positionWeight(value: number, totalValue: number): number {
  return totalValue > 0 ? (value / totalValue) * 100 : 0;
}

/** Una porción de la distribución: una por posición, sin agrupar en "otros". */
export interface DistributionSlice {
  coinId: string;
  symbol: string;
  name: string;
  /** Valor de la posición en dólares. */
  value: number;
  /** Peso sobre el valor total, en % (0 a 100). */
  weightPct: number;
}

/**
 * Serie de la tarta "Distribución" y de las barras "Peso de cada moneda".
 * Conserva el orden de las posiciones (por valor, de mayor a menor), que es
 * también el orden en que se reparten los colores.
 */
export function distributionSeries(positions: Position[], totalValue: number): DistributionSlice[] {
  return positions.map((position) => ({
    coinId: position.coinId,
    symbol: position.symbol,
    name: position.name,
    value: position.value,
    weightPct: positionWeight(position.value, totalValue),
  }));
}

/** Ganancia de una posición, para una gráfica de barras. */
export interface PositionGainPoint {
  coinId: string;
  symbol: string;
  name: string;
  /** Sobre el papel; `null` si la posición no tiene coste (no se puede saber). */
  unrealizedPnl: UsdMaybe;
  /** Ya materializada al vender. */
  realizedPnl: number;
}

/**
 * Serie "ganancia por posición", una entrada por posición abierta y en el
 * mismo orden. Las posiciones ya cerradas no salen aquí (no están en
 * `positions`); su ganancia realizada sí cuenta en el resumen.
 */
export function gainSeries(positions: Position[]): PositionGainPoint[] {
  return positions.map((position) => ({
    coinId: position.coinId,
    symbol: position.symbol,
    name: position.name,
    unrealizedPnl: position.unrealizedPnl,
    realizedPnl: position.realizedPnl,
  }));
}
