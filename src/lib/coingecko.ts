import type { Coin, FiatRate, GlobalMarket, PricePoint } from "@/types/coin";

/**
 * Base de la API. Se puede apuntar a un proxy propio o al dominio de pago
 * (`https://pro-api.coingecko.com/api/v3`) con VITE_COINGECKO_BASE.
 */
const API = import.meta.env.VITE_COINGECKO_BASE ?? "https://api.coingecko.com/api/v3";

/** Error con mensaje ya en español, listo para enseñar al usuario. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Si CoinGecko está saturado la conexión puede quedarse colgada, y sin esto
 *  la pantalla se quedaría cargando para siempre. */
const TIMEOUT_MS = 12_000;

function withTimeout(signal: AbortSignal | undefined): {
  signal: AbortSignal;
  cleanup: () => void;
  timedOut: () => boolean;
} {
  const controller = new AbortController();
  let expired = false;

  const timer = window.setTimeout(() => {
    expired = true;
    controller.abort();
  }, TIMEOUT_MS);

  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  return {
    signal: controller.signal,
    timedOut: () => expired,
    cleanup: () => {
      window.clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    },
  };
}

async function getJson(path: string, signal?: AbortSignal): Promise<unknown> {
  const guard = withTimeout(signal);
  let response: Response;
  try {
    response = await fetch(`${API}${path}`, { signal: guard.signal });
  } catch {
    if (guard.timedOut()) {
      throw new ApiError(408, "El servicio de precios tardó demasiado en responder.");
    }
    throw new ApiError(0, "No hay conexión con el servicio de precios.");
  } finally {
    guard.cleanup();
  }

  if (response.status === 429 || response.status === 503) {
    throw new ApiError(
      response.status,
      "CoinGecko está limitando las peticiones desde esta red. Espera un minuto y reintenta.",
    );
  }
  if (!response.ok) {
    throw new ApiError(response.status, `El servicio de precios respondió con error ${response.status}.`);
  }
  return response.json();
}

/** Lee un número de un objeto sin tipar; devuelve `fallback` si no lo es. */
function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** Igual que `num`, pero conserva el null cuando CoinGecko no tiene el dato. */
function numOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function toCoin(raw: Record<string, unknown>): Coin {
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

/** Top de monedas por capitalización de mercado. */
export async function fetchMarkets(perPage = 100, signal?: AbortSignal): Promise<Coin[]> {
  const data = await getJson(
    `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}` +
      `&page=1&sparkline=false&price_change_percentage=24h,7d`,
    signal,
  );
  if (!Array.isArray(data)) {
    throw new ApiError(0, "El servicio de precios devolvió un formato inesperado.");
  }
  return data.map((item) => toCoin(item as Record<string, unknown>));
}

/** Cifras globales del mercado: capitalización total, volumen y dominancia de BTC. */
export async function fetchGlobalMarket(signal?: AbortSignal): Promise<GlobalMarket> {
  const payload = await getJson("/global", signal);
  const data = (payload as { data?: Record<string, unknown> })?.data;
  if (!data) {
    throw new ApiError(0, "El servicio de precios devolvió un formato inesperado.");
  }
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

/** Histórico de precios de una moneda para los últimos `days` días. */
export async function fetchPriceHistory(
  coinId: string,
  days: number,
  signal?: AbortSignal,
): Promise<PricePoint[]> {
  const payload = await getJson(
    `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
    signal,
  );
  const prices = (payload as { prices?: unknown })?.prices;
  if (!Array.isArray(prices)) {
    throw new ApiError(0, "El servicio de precios devolvió un formato inesperado.");
  }

  return prices.map((entry) => {
    const [timestamp, price] = entry as [number, number];
    const moment = new Date(timestamp);
    return {
      date: moment.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
      fullDate: moment.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
      price: num(price),
    };
  });
}

/** Monedas fiat que ofrece el convertidor. */
const FIAT: ReadonlyArray<{ code: string; name: string }> = [
  { code: "USD", name: "Dólar estadounidense" },
  { code: "EUR", name: "Euro" },
  { code: "MXN", name: "Peso mexicano" },
  { code: "GBP", name: "Libra esterlina" },
  { code: "JPY", name: "Yen japonés" },
];

/**
 * Tasas fiat reales. CoinGecko las da respecto a 1 BTC, así que dividimos
 * la tasa del dólar entre la de cada moneda para saber cuántos dólares vale.
 */
export async function fetchFiatRates(signal?: AbortSignal): Promise<FiatRate[]> {
  const payload = await getJson("/exchange_rates", signal);
  const rates = (payload as { rates?: Record<string, unknown> })?.rates;
  if (!rates) {
    throw new ApiError(0, "El servicio de precios devolvió un formato inesperado.");
  }

  const usdPerBtc = num((rates.usd as { value?: unknown } | undefined)?.value);
  if (usdPerBtc <= 0) {
    throw new ApiError(0, "No se pudo leer la tasa del dólar.");
  }

  return FIAT.flatMap(({ code, name }) => {
    const unitsPerBtc = num((rates[code.toLowerCase()] as { value?: unknown } | undefined)?.value);
    if (unitsPerBtc <= 0) return [];
    return [{ code, name, usdPerUnit: usdPerBtc / unitsPerBtc }];
  });
}
