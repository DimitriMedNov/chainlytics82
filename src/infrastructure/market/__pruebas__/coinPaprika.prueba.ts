/**
 * Comprobaciones del adaptador de CoinPaprika con un cliente HTTP de mentira:
 * qué pide en cada método, cómo traduce los identificadores a los de CoinGecko
 * y qué hace con lo que el plan gratis no da. Se ejecutan con
 * `node --experimental-strip-types` sobre este archivo.
 */
import { ApiError } from "../../../application/shared/errors.ts";
import { createCoinPaprikaMarketData } from "../CoinPaprikaMarketData.ts";
import { knownPaprikaId, toGeckoId } from "../coinPaprikaIds.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const ticker = (id: string, symbol: string, rank: number, price: number) => ({
  id, symbol, rank, name: symbol, total_supply: 200, max_supply: 0,
  quotes: {
    USD: {
      price, market_cap: price * 100, volume_24h: 5, percent_change_24h: 1.5,
      percent_change_7d: -2, ath_price: price * 2, percent_from_price_ath: -50,
    },
  },
});

const TOP = [
  ticker("eth-ethereum", "ETH", 2, 2000),
  ticker("btc-bitcoin", "BTC", 1, 80000),
  ticker("xrp-xrp", "XRP", 5, 2),
  ticker("bnb-binance-coin", "BNB", 4, 600),
];

const NOW_MS = 1_800_000_000_000;
const NOW_S = NOW_MS / 1000;

/** Cliente de mentira: apunta cada ruta y responde según por qué empieza. */
function fakeApi(rutas: Record<string, unknown>) {
  const pedidas: string[] = [];
  const getJson = async (path: string): Promise<unknown> => {
    pedidas.push(path);
    const clave = Object.keys(rutas).find((inicio) => path.startsWith(inicio));
    if (!clave) throw new ApiError(404, `sin respuesta para ${path}`);
    return rutas[clave];
  };
  return { pedidas, market: createCoinPaprikaMarketData(getJson, () => NOW_MS) };
}

// --- Identificadores ---
check("id · regla general", toGeckoId("btc-bitcoin", "BTC"), "bitcoin");
check("id · nombre de varias palabras", toGeckoId("usdc-usd-coin", "USDC"), "usd-coin");
check("id · excepción XRP", toGeckoId("xrp-xrp", "XRP"), "ripple");
check("id · excepción BNB", toGeckoId("bnb-binance-coin", "BNB"), "binancecoin");
check("id · sin prefijo del símbolo se deja igual", toGeckoId("toncoin-raro", "TON"), "toncoin-raro");
check("id · inversa de la tabla", knownPaprikaId("avalanche-2"), "avax-avalanche");
check("id · inversa fuera de la tabla", knownPaprikaId("bitcoin"), undefined);

// --- getMarkets ---
{
  const { market, pedidas } = fakeApi({ "/tickers?limit=": TOP });
  const coins = await market.getMarkets(100);
  check("getMarkets · ruta", pedidas, ["/tickers?limit=100"]);
  check("getMarkets · ids de CoinGecko y orden por puesto", coins.map((c) => c.id), ["bitcoin", "ethereum", "binancecoin", "ripple"]);
  const btc = coins[0];
  check("getMarkets · campos", [btc.symbol, btc.price, btc.change24h, btc.change7d, btc.marketCap, btc.ath, btc.athChangePct],
    ["BTC", 80000, 1.5, -2, 8000000, 160000, -50]);
  check("getMarkets · circulante = capitalización / precio", btc.circulatingSupply, 100);
  check("getMarkets · sin máximo de emisión, FDV con el total", btc.fdv, 80000 * 200);
  check("getMarkets · lo que CoinPaprika no da queda en 0", [btc.high24h, btc.low24h, btc.atl], [0, 0, 0]);
  check("getMarkets · logo", btc.image, "https://static.coinpaprika.com/coin/btc-bitcoin/logo.png");
}

// --- getGlobalMarket ---
{
  const { market } = fakeApi({
    "/global": { market_cap_usd: 3e12, volume_24h_usd: 8e10, bitcoin_dominance_percentage: 56.9, market_cap_change_24h: 0.4 },
  });
  check("getGlobalMarket", await market.getGlobalMarket(),
    { totalMarketCap: 3e12, totalVolume24h: 8e10, btcDominance: 56.9, marketCapChange24hPct: 0.4 });
}

// --- getPriceHistory ---
{
  const historico = [{ timestamp: "2026-10-10T00:00:00Z", price: 10 }, { timestamp: "nada", price: 11 }];
  const { market, pedidas } = fakeApi({ "/tickers?limit=": TOP, "/tickers/": historico });
  const puntos = await market.getPriceHistory("ripple", 7);
  check("histórico · id traducido por la tabla, sin cargar el top", pedidas,
    [`/tickers/xrp-xrp/historical?start=${NOW_S - 7 * 86400}&interval=1d`]);
  check("histórico · fecha a milisegundos, sin fechas rotas", puntos, [{ timestamp: Date.parse("2026-10-10T00:00:00Z"), price: 10 }]);

  pedidas.length = 0;
  await market.getPriceHistory("bitcoin", 1);
  check("histórico · 24 h por horas, tras cargar el top", pedidas,
    ["/tickers?limit=250", `/tickers/btc-bitcoin/historical?start=${NOW_S - 23 * 3600}&interval=1h`]);

  pedidas.length = 0;
  await market.getPriceHistory("bitcoin", 365);
  check("histórico · 1 año se recorta a 364 días y reutiliza el id", pedidas,
    [`/tickers/btc-bitcoin/historical?start=${NOW_S - 364 * 86400}&interval=1d`]);
}
{
  const { market } = fakeApi({ "/tickers?limit=": TOP, "/search/": { currencies: [] } });
  let mensaje = "sin error";
  try { await market.getPriceHistory("moneda-que-no-existe", 7); } catch (error) { mensaje = (error as ApiError).message; }
  check("histórico · moneda desconocida", mensaje, "El servicio de respaldo no conoce esta moneda.");
}

// --- getFiatRates ---
{
  const { market, pedidas } = fakeApi({
    "/tickers/btc-bitcoin?quotes=USD,EUR,MXN": { quotes: { USD: { price: 80000 }, EUR: { price: 40000 }, MXN: { price: 1600000 } } },
    "/tickers/btc-bitcoin?quotes=USD,GBP,JPY": { quotes: { USD: { price: 80000 }, GBP: { price: 64000 } } },
  });
  const tasas = await market.getFiatRates();
  check("fiat · dos peticiones de 3 cotizaciones", pedidas,
    ["/tickers/btc-bitcoin?quotes=USD,EUR,MXN", "/tickers/btc-bitcoin?quotes=USD,GBP,JPY"]);
  check("fiat · dólares por unidad; la que falta se omite", tasas.map((t) => [t.code, t.usdPerUnit]),
    [["USD", 1], ["EUR", 2], ["MXN", 0.05], ["GBP", 1.25]]);
}

// --- searchCoins ---
{
  const { market, pedidas } = fakeApi({
    "/search/": { currencies: [{ id: "sol-solana", name: "Solana", symbol: "SOL", rank: 7 }, { id: "xrp-xrp", name: "XRP", symbol: "XRP", rank: 0 }] },
  });
  const res = await market.searchCoins("sol ana", 12);
  check("búsqueda · ruta", pedidas, ["/search/?q=sol%20ana&c=currencies&limit=12"]);
  check("búsqueda · ids de CoinGecko y puesto 0 como null", res.map((r) => [r.id, r.symbol, r.rank]),
    [["solana", "SOL", 7], ["ripple", "XRP", null]]);
}

// --- getCoinsByIds ---
{
  const { market, pedidas } = fakeApi({
    "/tickers?limit=": TOP,
    "/search/": { currencies: [{ id: "pepe-pepe", name: "Pepe", symbol: "PEPE", rank: 300 }] },
    "/tickers/pepe-pepe": ticker("pepe-pepe", "PEPE", 300, 0.00001),
  });
  const coins = await market.getCoinsByIds(["pepe", "ripple", "no-existe", "bitcoin"]);
  check("por ids · las del top en una petición; el resto, búsqueda y una a una", pedidas.slice(0, 1), ["/tickers?limit=250"]);
  check("por ids · se piden las de fuera del top", pedidas.includes("/tickers/pepe-pepe"), true);
  check("por ids · ids pedidos, por puesto, sin la desconocida", coins.map((c) => c.id), ["bitcoin", "ripple", "pepe"]);
}
