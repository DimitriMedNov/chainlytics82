/**
 * Comprobaciones de Mercados: búsqueda, filtros, orden, "Limpiar filtros",
 * estado del listado y las series de las gráficas.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { Coin } from "../../market/coin.ts";
import { buildChangeBars, buildTrendBreakdown, trendOf } from "../charts.ts";
import { filterCoins, isMarketFilter, isRising } from "../filters.ts";
import {
  clearCriteria,
  DEFAULT_MARKET_CRITERIA,
  hasActiveCriteria,
  resolveMarketListStatus,
  selectVisibleCoins,
} from "../listing.ts";
import { isMarketSortKey, sortCoins } from "../sorting.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const coin = (id: string, symbol: string, datos: Partial<Coin>): Coin => ({
  id, symbol, name: id, image: "", price: 0, change24h: 0, rank: 1, change7d: null,
  marketCap: 0, volume24h: 0, high24h: 0, low24h: 0, ath: 0, athChangePct: 0, atl: 0,
  circulatingSupply: 0, totalSupply: null, fdv: null, ...datos,
});

const btc = coin("bitcoin", "BTC", { name: "Bitcoin", rank: 1, price: 100_000, change24h: 2, marketCap: 900, volume24h: 50 });
const eth = coin("ethereum", "ETH", { name: "Ethereum", rank: 2, price: 2_000, change24h: -3, marketCap: 300, volume24h: 80 });
const usdt = coin("tether", "USDT", { name: "Tether", rank: 3, price: 1, change24h: 0, marketCap: 500, volume24h: 99 });
const coins = [eth, usdt, btc];
const ids = (lista: Coin[]) => lista.map((c) => c.id);

// Búsqueda
{
  check("busca por nombre sin mayúsculas", ids(filterCoins(coins, "BITC", "all")), ["bitcoin"]);
  check("busca por símbolo", ids(filterCoins(coins, "usdt", "all")), ["tether"]);
  check("ignora espacios alrededor", ids(filterCoins(coins, "  eth  ", "all")), ["ethereum", "tether"]);
  check("vacío deja todas", filterCoins(coins, "   ", "all").length, 3);
  check("no busca por id", filterCoins([coin("x-id", "ABC", { name: "Nombre" })], "x-id", "all").length, 0);
}

// Filtros y regla de signo
{
  check("suben: solo > 0", ids(filterCoins(coins, "", "gainers")), ["bitcoin"]);
  check("bajan: solo < 0", ids(filterCoins(coins, "", "losers")), ["ethereum"]);
  check("conservado: el 0 no entra en suben", filterCoins([usdt], "", "gainers").length, 0);
  check("conservado: la fila pinta el 0 como subida", isRising(usdt), true);
  check("fila: negativo baja", isRising(eth), false);
  check("búsqueda y filtro a la vez", filterCoins(coins, "eth", "gainers").length, 0);
  check("reconoce un filtro válido", [isMarketFilter("losers"), isMarketFilter("otro")], [true, false]);
}

// Orden
{
  check("capitalización desc", ids(sortCoins(coins, "marketcap")), ["bitcoin", "tether", "ethereum"]);
  check("volumen desc", ids(sortCoins(coins, "volume")), ["tether", "ethereum", "bitcoin"]);
  check("cambio desc", ids(sortCoins(coins, "change")), ["bitcoin", "tether", "ethereum"]);
  check("precio desc", ids(sortCoins(coins, "price")), ["bitcoin", "ethereum", "tether"]);
  check("ranking asc", ids(sortCoins(coins, "rank")), ["bitcoin", "ethereum", "tether"]);
  check("no toca la lista recibida", ids(coins), ["ethereum", "tether", "bitcoin"]);
  check("reconoce una clave válida", [isMarketSortKey("rank"), isMarketSortKey("nombre")], [true, false]);
}

// Lista visible y "Limpiar filtros"
{
  check("por defecto: todas, por capitalización", ids(selectVisibleCoins(coins, DEFAULT_MARKET_CRITERIA)), ["bitcoin", "tether", "ethereum"]);
  check("sin datos no hay nada", selectVisibleCoins(undefined, DEFAULT_MARKET_CRITERIA), []);
  const puesto = { searchTerm: "bit", filter: "gainers", sortBy: "price" } as const;
  check("filtra y ordena", ids(selectVisibleCoins(coins, puesto)), ["bitcoin"]);
  check("conservado: limpiar no restablece el orden", clearCriteria(puesto), { searchTerm: "", filter: "all", sortBy: "price" });
  check("hay filtros activos", [hasActiveCriteria(puesto), hasActiveCriteria(DEFAULT_MARKET_CRITERIA)], [true, false]);
  check("el orden solo no cuenta como filtro", hasActiveCriteria({ ...DEFAULT_MARKET_CRITERIA, sortBy: "rank" }), false);
}

// Estado del listado
{
  const base = { isError: false, isPending: false, totalCount: 3, visibleCount: 3 };
  check("listo", resolveMarketListStatus(base), "ready");
  check("cargando", resolveMarketListStatus({ ...base, isPending: true, totalCount: 0, visibleCount: 0 }), "loading");
  check("el error gana a cargando", resolveMarketListStatus({ ...base, isError: true, isPending: true }), "error");
  check("vacío por filtros", resolveMarketListStatus({ ...base, visibleCount: 0 }), "empty-filters");
  check("vacío por la API", resolveMarketListStatus({ ...base, totalCount: 0, visibleCount: 0 }), "empty-api");
}

// Series de las gráficas
{
  check("barras en el orden recibido", buildChangeBars(coins).map((b) => [b.symbol, b.change24h, b.rising]), [["ETH", -3, false], ["USDT", 0, true], ["BTC", 2, true]]);
  check("barras con tope", buildChangeBars(coins, 2).map((b) => b.id), ["ethereum", "tether"]);
  check("tope negativo no rompe", buildChangeBars(coins, -1), []);
  check("tendencia: el 0 es sin cambio", [trendOf(btc), trendOf(eth), trendOf(usdt)], ["up", "down", "flat"]);
  check("reparto: cuentas", buildTrendBreakdown([btc, btc, eth, usdt]).map((t) => [t.key, t.count, t.share]), [["up", 2, 50], ["down", 1, 25], ["flat", 1, 25]]);
  check("reparto vacío: tres trozos a 0", buildTrendBreakdown([]).map((t) => [t.count, t.share]), [[0, 0], [0, 0], [0, 0]]);
}
