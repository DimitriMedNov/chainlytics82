import type { Coin } from "../../../domain/market/coin.ts";
import { isRising } from "../../../domain/panel/topCoins.ts";
import { formatCompact, formatCurrency, formatPercent } from "../../shared/presentation/format.ts";

/** Una fila de la tabla del top, con sus textos ya formateados. */
export interface TopCoinRow {
  /** Id de CoinGecko: sirve de `key`. */
  id: string;
  name: string;
  symbol: string;
  /** URL de la imagen (32 × 32 en la tabla, decorativa: `alt=""`). */
  image: string;
  price: string;
  change: string;
  /** true: flecha arriba y color de subida. */
  rising: boolean;
  volume: string;
}

export function toTopCoinRow(coin: Coin): TopCoinRow {
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    image: coin.image,
    price: formatCurrency(coin.price),
    change: formatPercent(coin.change24h),
    rising: isRising(coin.change24h),
    volume: formatCompact(coin.volume24h),
  };
}

export function toTopCoinRows(coins: readonly Coin[]): TopCoinRow[] {
  return coins.map(toTopCoinRow);
}
