/**
 * Comprobaciones del proveedor con respaldo, con dos proveedores de mentira:
 * cuándo se llama al respaldo, cuándo no, y qué error llega si fallan los dos.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { MarketDataPort } from "../../../application/market/ports.ts";
import { ApiError } from "../../../application/shared/errors.ts";
import type { Coin } from "../../../domain/market/coin.ts";
import { createFallbackMarketData } from "../FallbackMarketData.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const coin = (id: string) => ({ id }) as Coin;

/** Proveedor de mentira: apunta cada llamada y responde o falla según `fallo`. */
function fakePort(nombre: string, fallo?: () => Error) {
  const llamadas: string[] = [];
  const responder = async <T>(metodo: string, args: unknown[], valor: T): Promise<T> => {
    llamadas.push(`${metodo}(${args.join(",")})`);
    if (fallo) throw fallo();
    return valor;
  };
  const port: MarketDataPort = {
    getMarkets: (perPage) => responder("getMarkets", [perPage], [coin(nombre)]),
    getGlobalMarket: () =>
      responder("getGlobalMarket", [], {
        totalMarketCap: nombre.length, totalVolume24h: 0, btcDominance: 0, marketCapChange24hPct: 0,
      }),
    getPriceHistory: (coinId, days) =>
      responder("getPriceHistory", [coinId, days], [{ timestamp: 1, price: nombre.length }]),
    getFiatRates: () => responder("getFiatRates", [], [{ code: "USD", name: nombre, usdPerUnit: 1 }]),
    searchCoins: (term, limit) =>
      responder("searchCoins", [term, limit], [{ id: nombre, name: "", symbol: "", thumb: "", rank: null }]),
    getCoinsByIds: (ids) => responder("getCoinsByIds", [ids.join("+")], [coin(nombre)]),
  };
  return { port, llamadas };
}

async function capturar(promesa: Promise<unknown>): Promise<string> {
  try {
    await promesa;
    return "sin error";
  } catch (error) {
    return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  }
}

const abortError = () => Object.assign(new Error("cancelada"), { name: "AbortError" });

// 1. El principal responde: el respaldo ni se toca.
{
  const principal = fakePort("principal");
  const respaldo = fakePort("respaldo");
  const market = createFallbackMarketData(principal.port, respaldo.port);
  check("principal bien · dato del principal", (await market.getMarkets(100))[0].id, "principal");
  check("principal bien · respaldo sin llamadas", respaldo.llamadas, []);
}

// 2. El principal falla (429, red, tiempo agotado): la MISMA petición va al respaldo.
for (const [caso, status] of [["429", 429], ["red", 0], ["tiempo agotado", 408]] as const) {
  const principal = fakePort("principal", () => new ApiError(status, `fallo ${caso}`));
  const respaldo = fakePort("respaldo");
  const market = createFallbackMarketData(principal.port, respaldo.port);
  check(`${caso} · getMarkets sale del respaldo`, (await market.getMarkets(100))[0].id, "respaldo");
  check(`${caso} · mismos argumentos`, respaldo.llamadas, ["getMarkets(100)"]);
}

// 3. Los seis métodos pasan por el respaldo con sus argumentos intactos.
{
  const principal = fakePort("principal", () => new ApiError(429, "limitado"));
  const respaldo = fakePort("respaldo");
  const market = createFallbackMarketData(principal.port, respaldo.port);
  await market.getMarkets(50);
  await market.getGlobalMarket();
  await market.getPriceHistory("bitcoin", 7);
  await market.getFiatRates();
  await market.searchCoins("sol", 12);
  await market.getCoinsByIds(["bitcoin", "ethereum"]);
  const esperadas = [
    "getMarkets(50)", "getGlobalMarket()", "getPriceHistory(bitcoin,7)",
    "getFiatRates()", "searchCoins(sol,12)", "getCoinsByIds(bitcoin+ethereum)",
  ];
  check("seis métodos · llamadas al principal", principal.llamadas, esperadas);
  check("seis métodos · llamadas al respaldo", respaldo.llamadas, esperadas);
}

// 4. Fallan los dos: llega el error del principal, una sola vez cada proveedor.
{
  const principal = fakePort("principal", () => new ApiError(429, "CoinGecko limita"));
  const respaldo = fakePort("respaldo", () => new ApiError(500, "CoinPaprika caído"));
  const market = createFallbackMarketData(principal.port, respaldo.port);
  check("fallan los dos · error del principal", await capturar(market.getGlobalMarket()), "ApiError: CoinGecko limita");
  check("fallan los dos · un intento cada uno", [principal.llamadas.length, respaldo.llamadas.length], [1, 1]);
}

// 5. Petición cancelada (señal abortada): no cuenta como fallo, no hay respaldo.
{
  const controller = new AbortController();
  controller.abort();
  // El cliente HTTP convierte el corte en ApiError(0): lo que manda es la señal.
  const principal = fakePort("principal", () => new ApiError(0, "No se pudo contactar"));
  const respaldo = fakePort("respaldo");
  const market = createFallbackMarketData(principal.port, respaldo.port);
  check("cancelada · se propaga el error", await capturar(market.getMarkets(100, controller.signal)), "ApiError: No se pudo contactar");
  check("cancelada · respaldo sin llamadas", respaldo.llamadas, []);
}

// 6. AbortError sin señal a mano: tampoco va al respaldo.
{
  const principal = fakePort("principal", abortError);
  const respaldo = fakePort("respaldo");
  const market = createFallbackMarketData(principal.port, respaldo.port);
  check("AbortError · se propaga", await capturar(market.getFiatRates()), "AbortError: cancelada");
  check("AbortError · respaldo sin llamadas", respaldo.llamadas, []);
}

// 7. Se cancela mientras responde el respaldo: llega la cancelación, no el error del principal.
{
  const controller = new AbortController();
  const principal = fakePort("principal", () => new ApiError(429, "limitado"));
  const respaldo = fakePort("respaldo", () => {
    controller.abort();
    return abortError();
  });
  const market = createFallbackMarketData(principal.port, respaldo.port);
  check("cancelada en el respaldo", await capturar(market.searchCoins("btc", 12, controller.signal)), "AbortError: cancelada");
}
