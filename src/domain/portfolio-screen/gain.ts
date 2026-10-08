import type { PortfolioSummary, Position } from "../portfolio/types.ts";
import type { UsdMaybe } from "../shared/money.ts";

/**
 * Una ganancia lista para pintar: o no se puede saber ("—"), o se conoce y
 * lleva su signo, su valor absoluto y, si lo hay, su porcentaje.
 */
export type Gain =
  | { readonly known: false }
  | {
      readonly known: true;
      /** true si es ganancia o cero; false si es pérdida. Decide el color. */
      readonly rises: boolean;
      /** "+" para ganancia o cero; "−" (signo menos tipográfico) para pérdida. */
      readonly sign: "+" | "−";
      /** Valor sin signo, para formatear detrás de `sign`. */
      readonly absValue: number;
      readonly value: number;
      /** Porcentaje con su signo propio, o `null` si no se enseña. */
      readonly pct: number | null;
    };

/** Regla de signo: cero cuenta como ganancia ("+" y color de subida). */
export function gainOf(value: UsdMaybe, pct: number | null): Gain {
  if (value === null) return { known: false };
  const rises = value >= 0;
  return { known: true, rises, sign: rises ? "+" : "−", absValue: Math.abs(value), value, pct };
}

/** Ganancia sobre el papel de una posición ("—" si no tiene coste). */
export function positionUnrealizedGain(position: Position): Gain {
  return gainOf(position.unrealizedPnl, position.unrealizedPnlPct);
}

/** Ganancia realizada de una posición (sin porcentaje). */
export function positionRealizedGain(position: Position): Gain {
  return gainOf(position.realizedPnl, null);
}

/** La ganancia realizada de una posición solo se enseña si no es cero. */
export function hasRealizedGain(position: Position): boolean {
  return position.realizedPnl !== 0;
}

/** Una posición "sin coste": alguna compra no tiene precio registrado. */
export function needsCost(position: Position): boolean {
  return position.avgCost === null;
}

/** Las cifras de las cuatro tarjetas de cabecera. */
export interface SummaryFigures {
  value: number;
  change24hPct: number;
  /** true si el cambio de 24 h es positivo o cero. Decide icono y color. */
  change24hRises: boolean;
  invested: number;
  positionsWithoutCost: number;
  /** Ganancia sobre el papel, en $ y %. */
  unrealized: Gain;
  /** Ganancia realizada, solo en $. */
  realized: Gain;
}

/**
 * Regla "sin invertido no hay ganancia": si lo invertido es 0 (no hay
 * posiciones con coste conocido), la ganancia sobre el papel es desconocida.
 */
export function summaryFigures(summary: PortfolioSummary): SummaryFigures {
  const hasInvested = summary.invested > 0;
  return {
    value: summary.value,
    change24hPct: summary.change24hPct,
    change24hRises: summary.change24hPct >= 0,
    invested: summary.invested,
    positionsWithoutCost: summary.positionsWithoutCost,
    unrealized: gainOf(
      hasInvested ? summary.unrealizedPnl : null,
      hasInvested ? summary.unrealizedPnlPct : null,
    ),
    realized: gainOf(summary.realizedPnl, null),
  };
}
