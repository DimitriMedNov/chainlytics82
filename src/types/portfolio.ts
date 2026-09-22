/** Un movimiento del portfolio: lo que de verdad guardamos. */
export interface Transaction {
  id: string;
  coinId: string;
  symbol: string;
  kind: "compra" | "venta";
  amount: number;
  /**
   * Precio por unidad en dólares. null significa "no lo recuerdo": preferimos
   * no saber el coste a inventárnoslo.
   */
  unitPrice: number | null;
  /** Fecha del movimiento, en ISO. */
  happenedAt: string;
}

/** Lo que se necesita para crear un movimiento. */
export type NewTransaction = Omit<Transaction, "id">;

/** Una posición calculada a partir de sus movimientos. */
export interface Position {
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  /** Cantidad que queda: compras menos ventas. */
  amount: number;
  price: number;
  change24h: number;
  value: number;
  /**
   * Coste medio ponderado por unidad. null cuando alguna compra no tiene
   * precio registrado y por tanto el coste no se puede saber.
   */
  avgCost: number | null;
  /** Lo invertido que sigue dentro de la posición. null si el coste no se sabe. */
  invested: number | null;
  /** Ganancia o pérdida sobre el papel. null si el coste no se sabe. */
  unrealizedPnl: number | null;
  unrealizedPnlPct: number | null;
  /** Ganancia ya materializada al vender. */
  realizedPnl: number;
}

export interface PortfolioSummary {
  value: number;
  change24hValue: number;
  change24hPct: number;
  /** Suma de lo invertido en las posiciones cuyo coste sí conocemos. */
  invested: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  realizedPnl: number;
  /** Cuántas posiciones quedan fuera del cálculo por no tener coste. */
  positionsWithoutCost: number;
  best: Position | null;
}
