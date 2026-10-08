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

/**
 * Un punto del histórico de precios. Las etiquetas de fecha para el eje y el
 * tooltip son presentación: las pone `labelPricePoints` en `application`.
 */
export interface PricePoint {
  /** Milisegundos desde la época. Es lo que permite cruzar varias series. */
  timestamp: number;
  price: number;
}

/** Un resultado de búsqueda: aún sin precio, solo lo justo para identificarla. */
export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  rank: number | null;
}

/** Busca una moneda concreta dentro del top que ya tenemos cargado. */
export function findCoin(coins: Coin[] | undefined, idOrSymbol: string): Coin | undefined {
  if (!coins) return undefined;
  const needle = idOrSymbol.toLowerCase();
  return coins.find((coin) => coin.id === needle || coin.symbol.toLowerCase() === needle);
}
