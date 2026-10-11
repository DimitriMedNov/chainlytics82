import { trend24h, type Trend } from "../../../domain/coin-detail/figures.ts";
import type { Coin } from "../../../domain/market/coin.ts";
import {
  formatCompact,
  formatCurrency,
  formatPercent,
  formatSupply,
} from "../../shared/presentation/format.ts";
import { COIN_DETAIL_TEXTS as T } from "./texts.ts";

/** Una fila "etiqueta: valor" ya escrita. */
export interface DetailRow {
  /** Clave estable para `key` de React. */
  id: string;
  label: string;
  value: string;
  /** Color con el que se pintaba el valor: máximo en verde, mínimo en naranja. */
  tone: "success" | "warning" | "neutral";
}

export interface CoinDetailView {
  header: { name: string; symbol: string; image: string; rankLabel: string };
  price: {
    label: string;
    value: string;
    change24h: string;
    change24hSuffix: string;
    trend: Trend;
    /** "· +1.20 % en 7 d"; `null` si no hay dato: no se pinta nada. */
    change7d: string | null;
  };
  /** Máximo y mínimo de 24 h, máximo y mínimo histórico. */
  priceRows: DetailRow[];
  marketCap: { title: string; value: string; rows: DetailRow[] };
  volume: { title: string; value: string; rows: DetailRow[] };
  additional: { title: string; rows: DetailRow[] };
}

function row(id: string, label: string, value: string, tone: DetailRow["tone"] = "neutral"): DetailRow {
  return { id, label, value, tone };
}

/**
 * Fila de un precio que el proveedor puede no dar (el de respaldo no trae
 * máximo ni mínimo de 24 h ni mínimo histórico, y llegan en 0): sin dato se
 * escribe "No disponible", sin color, en vez de un "$0" que parecería real.
 */
function priceRow(id: string, label: string, price: number, tone: DetailRow["tone"] = "neutral"): DetailRow {
  const known = Number.isFinite(price) && price > 0;
  return row(id, label, known ? formatCurrency(price) : T.unavailable, known ? tone : "neutral");
}

/**
 * Todo lo que el modal escribe de una moneda, ya formateado y con sus textos.
 * Sale de `CryptoHeader`, `CryptoPriceSection`, `CryptoMarketStats` y
 * `CryptoAdditionalInfo`; conserva qué se enseña cuando un dato falta.
 */
export function presentCoinDetail(coin: Coin): CoinDetailView {
  const rankLabel = `#${coin.rank}`;

  return {
    header: { name: coin.name, symbol: coin.symbol, image: coin.image, rankLabel },
    price: {
      label: T.priceLabel,
      value: formatCurrency(coin.price),
      change24h: formatPercent(coin.change24h),
      change24hSuffix: T.change24hSuffix,
      trend: trend24h(coin),
      // Sin dato de 7 días, aquí no se pinta nada (en "Información adicional"
      // sí sale "No disponible").
      change7d: coin.change7d === null ? null : `· ${formatPercent(coin.change7d)} en 7 d`,
    },
    priceRows: [
      priceRow("high24h", T.high24h, coin.high24h, "success"),
      priceRow("low24h", T.low24h, coin.low24h, "warning"),
      row("ath", T.ath, formatCurrency(coin.ath)),
      priceRow("atl", T.atl, coin.atl),
    ],
    marketCap: {
      title: T.marketCapTitle,
      value: formatCompact(coin.marketCap),
      rows: [
        row("fdv", T.fdv, coin.fdv === null ? T.unavailable : formatCompact(coin.fdv)),
        row("rank", T.rank, rankLabel),
      ],
    },
    volume: {
      title: T.volumeTitle,
      value: formatCompact(coin.volume24h),
      rows: [
        // `formatSupply` devuelve "No disponible" con 0 o `null`.
        row("circulatingSupply", T.circulatingSupply, formatSupply(coin.circulatingSupply)),
        row("totalSupply", T.totalSupply, formatSupply(coin.totalSupply)),
      ],
    },
    additional: {
      title: T.additionalTitle,
      rows: [
        row("symbol", T.symbol, coin.symbol),
        row("id", T.coinGeckoId, coin.id),
        row("athDistance", T.athDistance, formatPercent(coin.athChangePct)),
        row(
          "change7d",
          T.change7d,
          coin.change7d === null ? T.unavailable : formatPercent(coin.change7d),
        ),
      ],
    },
  };
}
