import { ApiError } from "@/application/shared/errors";
import type { Coin, CoinSearchResult, GlobalMarket, PricePoint } from "@/domain/market/coin";
import { FIAT, type FiatRate } from "@/domain/market/fiat";
import {
  num,
  numOrNull,
  str,
  type CoinMarketDto,
  type CoinSearchDto,
  type ExchangeRateDto,
} from "./dto";

const FORMATO_INESPERADO = "El servicio de precios devolvió un formato inesperado.";

export function toCoin(raw: CoinMarketDto): Coin {
  return {
    id: str(raw.id),
    rank: num(raw.market_cap_rank, 0),
    name: str(raw.name),
    symbol: str(raw.symbol).toUpperCase(),
    image: str(raw.image),
    price: num(raw.current_price),
    change24h: num(raw.price_change_percentage_24h),
    change7d: numOrNull(raw.price_change_percentage_7d_in_currency),
    marketCap: num(raw.market_cap),
    volume24h: num(raw.total_volume),
    high24h: num(raw.high_24h),
    low24h: num(raw.low_24h),
    ath: num(raw.ath),
    athChangePct: num(raw.ath_change_percentage),
    atl: num(raw.atl),
    circulatingSupply: num(raw.circulating_supply),
    totalSupply: numOrNull(raw.total_supply),
    fdv: numOrNull(raw.fully_diluted_valuation),
  };
}

export function toCoins(data: unknown): Coin[] {
  if (!Array.isArray(data)) throw new ApiError(0, FORMATO_INESPERADO);
  return data.map((item) => toCoin(item as CoinMarketDto));
}

export function toGlobalMarket(payload: unknown): GlobalMarket {
  const data = (payload as { data?: Record<string, unknown> })?.data;
  if (!data) throw new ApiError(0, FORMATO_INESPERADO);

  const totalMarketCap = data.total_market_cap as Record<string, unknown> | undefined;
  const totalVolume = data.total_volume as Record<string, unknown> | undefined;
  const dominance = data.market_cap_percentage as Record<string, unknown> | undefined;

  return {
    totalMarketCap: num(totalMarketCap?.usd),
    totalVolume24h: num(totalVolume?.usd),
    btcDominance: num(dominance?.btc),
    marketCapChange24hPct: num(data.market_cap_change_percentage_24h_usd),
  };
}

export function toPricePoints(payload: unknown): PricePoint[] {
  const prices = (payload as { prices?: unknown })?.prices;
  if (!Array.isArray(prices)) throw new ApiError(0, FORMATO_INESPERADO);

  return prices.map((entry) => {
    const [timestamp, price] = entry as [number, number];
    return { timestamp, price: num(price) };
  });
}

/**
 * CoinGecko da las tasas respecto a 1 BTC, así que dividimos la tasa del
 * dólar entre la de cada moneda para saber cuántos dólares vale.
 */
export function toFiatRates(payload: unknown): FiatRate[] {
  const rates = (payload as { rates?: Record<string, unknown> })?.rates;
  if (!rates) throw new ApiError(0, FORMATO_INESPERADO);

  const usdPerBtc = num((rates.usd as ExchangeRateDto | undefined)?.value);
  if (usdPerBtc <= 0) throw new ApiError(0, "No se pudo leer la tasa del dólar.");

  return FIAT.flatMap(({ code, name }) => {
    const unitsPerBtc = num((rates[code.toLowerCase()] as ExchangeRateDto | undefined)?.value);
    if (unitsPerBtc <= 0) return [];
    return [{ code, name, usdPerUnit: usdPerBtc / unitsPerBtc }];
  });
}

/** Devuelve como mucho `limit` resultados, los mejor posicionados. */
export function toSearchResults(payload: unknown, limit: number): CoinSearchResult[] {
  const coins = (payload as { coins?: unknown })?.coins;
  if (!Array.isArray(coins)) return [];

  return coins.slice(0, limit).map((item) => {
    const raw = item as CoinSearchDto;
    return {
      id: str(raw.id),
      name: str(raw.name),
      symbol: str(raw.symbol).toUpperCase(),
      thumb: str(raw.thumb ?? raw.large),
      rank: numOrNull(raw.market_cap_rank),
    };
  });
}
