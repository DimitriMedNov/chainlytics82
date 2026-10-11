import { ApiError } from "../../application/shared/errors.ts";
import type { Coin, CoinSearchResult, GlobalMarket, PricePoint } from "../../domain/market/coin.ts";
import { FIAT, type FiatRate } from "../../domain/market/fiat.ts";
import { toGeckoId } from "./coinPaprikaIds.ts";
import { num, numOrNull, str } from "./dto.ts";

const FORMATO_INESPERADO = "El servicio de precios de respaldo devolvió un formato inesperado.";

type Raw = Record<string, unknown>;

function asRecord(value: unknown): Raw {
  return typeof value === "object" && value !== null ? (value as Raw) : {};
}

export function paprikaLogo(paprikaId: string): string {
  return `https://static.coinpaprika.com/coin/${paprikaId}/logo.png`;
}

/**
 * Fila de `/tickers` → moneda de la app, con el id de CoinGecko.
 * CoinPaprika no da máximo ni mínimo de 24 h ni mínimo histórico: quedan en 0,
 * el mismo relleno que usa el mapper de CoinGecko cuando falta un número.
 */
export function toCoin(raw: unknown): Coin {
  const row = asRecord(raw);
  const usd = asRecord(asRecord(row.quotes).USD);
  const paprikaId = str(row.id);
  const symbol = str(row.symbol).toUpperCase();
  const price = num(usd.price);
  const marketCap = num(usd.market_cap);
  const maxSupply = num(row.max_supply);
  const totalSupply = num(row.total_supply);
  const dilutedSupply = maxSupply > 0 ? maxSupply : totalSupply;

  return {
    id: toGeckoId(paprikaId, symbol),
    rank: num(row.rank, 0),
    name: str(row.name),
    symbol,
    image: paprikaLogo(paprikaId),
    price,
    change24h: num(usd.percent_change_24h),
    change7d: numOrNull(usd.percent_change_7d),
    marketCap,
    volume24h: num(usd.volume_24h),
    high24h: 0,
    low24h: 0,
    ath: num(usd.ath_price),
    athChangePct: num(usd.percent_from_price_ath),
    atl: 0,
    circulatingSupply: price > 0 ? marketCap / price : 0,
    totalSupply: totalSupply > 0 ? totalSupply : null,
    fdv: dilutedSupply > 0 ? price * dilutedSupply : null,
  };
}

export function toCoins(data: unknown): Coin[] {
  if (!Array.isArray(data)) throw new ApiError(0, FORMATO_INESPERADO);
  return data.map(toCoin);
}

export function toGlobalMarket(payload: unknown): GlobalMarket {
  const data = asRecord(payload);
  if (typeof data.market_cap_usd !== "number") throw new ApiError(0, FORMATO_INESPERADO);
  return {
    totalMarketCap: num(data.market_cap_usd),
    totalVolume24h: num(data.volume_24h_usd),
    btcDominance: num(data.bitcoin_dominance_percentage),
    marketCapChange24hPct: num(data.market_cap_change_24h),
  };
}

/** `/tickers/{id}/historical` da la fecha en texto ISO; la app usa milisegundos. */
export function toPricePoints(payload: unknown): PricePoint[] {
  if (!Array.isArray(payload)) throw new ApiError(0, FORMATO_INESPERADO);
  return payload.flatMap((entry) => {
    const point = asRecord(entry);
    const timestamp = Date.parse(str(point.timestamp));
    return Number.isFinite(timestamp) ? [{ timestamp, price: num(point.price) }] : [];
  });
}

/**
 * CoinPaprika no tiene tasas fiat: se sacan del precio de 1 BTC en cada
 * moneda. Admite 3 cotizaciones por petición, así que llegan varias respuestas.
 */
export function toFiatRates(payloads: unknown[]): FiatRate[] {
  const btcIn = new Map<string, number>();
  for (const payload of payloads) {
    for (const [code, quote] of Object.entries(asRecord(asRecord(payload).quotes))) {
      btcIn.set(code.toUpperCase(), num(asRecord(quote).price));
    }
  }
  const usdPerBtc = btcIn.get("USD") ?? 0;
  if (usdPerBtc <= 0) throw new ApiError(0, "No se pudo leer la tasa del dólar.");

  return FIAT.flatMap(({ code, name }) => {
    const unitsPerBtc = btcIn.get(code) ?? 0;
    return unitsPerBtc > 0 ? [{ code, name, usdPerUnit: usdPerBtc / unitsPerBtc }] : [];
  });
}

export function toSearchResults(payload: unknown, limit: number): CoinSearchResult[] {
  const currencies = asRecord(payload).currencies;
  if (!Array.isArray(currencies)) return [];

  return currencies.slice(0, limit).map((item) => {
    const row = asRecord(item);
    const paprikaId = str(row.id);
    const symbol = str(row.symbol).toUpperCase();
    const rank = num(row.rank, 0);
    return {
      id: toGeckoId(paprikaId, symbol),
      name: str(row.name),
      symbol,
      thumb: paprikaLogo(paprikaId),
      rank: rank > 0 ? rank : null,
    };
  });
}
