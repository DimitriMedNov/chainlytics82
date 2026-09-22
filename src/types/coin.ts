/** Una moneda tal como la usa la app, ya normalizada desde CoinGecko. */
export interface Coin {
  /** Id de CoinGecko, p. ej. "bitcoin". Es la clave estable de la moneda. */
  id: string;
  rank: number;
  name: string;
  /** Siempre en mayúsculas: BTC, ETH... */
  symbol: string;
  image: string;
  price: number;
  change24h: number;
  change7d: number | null;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  ath: number;
  athChangePct: number;
  atl: number;
  circulatingSupply: number;
  totalSupply: number | null;
  /** Capitalización totalmente diluida. CoinGecko la deja en null en algunas monedas. */
  fdv: number | null;
}

/** Datos globales del mercado (endpoint /global). */
export interface GlobalMarket {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  marketCapChange24hPct: number;
}

/** Un punto del gráfico de precios. */
export interface PricePoint {
  /** Milisegundos desde la época. Es lo que permite cruzar varias series. */
  timestamp: number;
  /** Etiqueta corta para el eje X. */
  date: string;
  /** Fecha completa para el tooltip. */
  fullDate: string;
  price: number;
}

/** Una moneda fiat convertible (USD, EUR, MXN...). */
export interface FiatRate {
  code: string;
  name: string;
  /** Cuánto vale 1 unidad de esta moneda en dólares. */
  usdPerUnit: number;
}
