/**
 * Comprobaciones de la pantalla Watchlist: orden, búsqueda, reparto en
 * secciones, contador, estado de la pantalla y serie de la gráfica.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { WatchlistCoin } from "../../watchlist/entries.ts";
import { change24hSeries } from "../chart.ts";
import { followedCountLabel } from "../counter.ts";
import { DEFAULT_SORT, nextSort, sortCoins } from "../sort.ts";
import { resolveWatchlistStatus, type WatchlistStatusInput } from "../status.ts";
import { filterBySearch, hiddenEntryCount, splitByFavorite } from "../view.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const coin = (
  symbol: string,
  name: string,
  price: number,
  change24h: number,
  isFavorite = false,
): WatchlistCoin => ({
  id: name.toLowerCase(), symbol, name, image: "", price, change24h, isFavorite, rank: 1,
  change7d: null, marketCap: 0, volume24h: 0, high24h: 0, low24h: 0, ath: 0, athChangePct: 0,
  atl: 0, circulatingSupply: 0, totalSupply: null, fdv: null,
});

const btc = coin("BTC", "Bitcoin", 100_000, -1.5, true);
const eth = coin("ETH", "Ethereum", 2_000, 3);
const ada = coin("ADA", "Cardano", 0.5, 0);
const lista = [eth, btc, ada];
const simbolos = (items: WatchlistCoin[]) => items.map((item) => item.symbol);

// Orden
{
  check("orden por defecto: nombre ascendente", DEFAULT_SORT, { field: "name", order: "asc" });
  check("por nombre asc", simbolos(sortCoins(lista, DEFAULT_SORT)), ["BTC", "ADA", "ETH"]);
  check("por nombre desc", simbolos(sortCoins(lista, { field: "name", order: "desc" })), ["ETH", "ADA", "BTC"]);
  check("por precio asc", simbolos(sortCoins(lista, { field: "price", order: "asc" })), ["ADA", "ETH", "BTC"]);
  check("por precio desc", simbolos(sortCoins(lista, { field: "price", order: "desc" })), ["BTC", "ETH", "ADA"]);
  check("por cambio asc", simbolos(sortCoins(lista, { field: "change", order: "asc" })), ["BTC", "ADA", "ETH"]);
  check("por cambio desc", simbolos(sortCoins(lista, { field: "change", order: "desc" })), ["ETH", "ADA", "BTC"]);
  check("no toca la lista recibida", simbolos(lista), ["ETH", "BTC", "ADA"]);
  check("el nombre se compara en español (tilde junto a su letra)",
    sortCoins([coin("Z", "Zeta", 1, 0), coin("A", "Ápice", 1, 0), coin("B", "Beta", 1, 0)], DEFAULT_SORT)
      .map((item) => item.name), ["Ápice", "Beta", "Zeta"]);
  check("repetir clave invierte", nextSort(DEFAULT_SORT, "name"), { field: "name", order: "desc" });
  check("repetir dos veces vuelve a asc", nextSort(nextSort(DEFAULT_SORT, "name"), "name"), DEFAULT_SORT);
  check("cambiar de clave empieza en asc",
    nextSort({ field: "name", order: "desc" }, "price"), { field: "price", order: "asc" });
}

// Búsqueda
{
  check("búsqueda vacía devuelve todo", filterBySearch(lista, "") === lista, true);
  check("solo espacios cuenta como vacía", filterBySearch(lista, "   ") === lista, true);
  check("por nombre, sin mayúsculas", simbolos(filterBySearch(lista, "BITC")), ["BTC"]);
  check("por símbolo", simbolos(filterBySearch(lista, "eth")), ["ETH"]);
  check("recorta espacios", simbolos(filterBySearch(lista, "  ada ")), ["ADA"]);
  check("coincide en mitad del nombre", simbolos(filterBySearch(lista, "ar")), ["ADA"]);
  check("sin coincidencias", filterBySearch(lista, "zzz"), []);
}

// Reparto en secciones
{
  const partes = splitByFavorite(lista);
  check("favoritas", simbolos(partes.favorites), ["BTC"]);
  check("todas = las no favoritas, en su orden", simbolos(partes.others), ["ETH", "ADA"]);
  check("sin favoritas", splitByFavorite([eth, ada]).favorites, []);
  check("todas favoritas deja el resto vacío", splitByFavorite([btc]).others, []);
  check("ocultas: 3 guardadas, 1 con precio", hiddenEntryCount(3, 1, true), 2);
  check("ocultas: sin mercado cargado no se sabe", hiddenEntryCount(3, 0, false), 0);
  check("ocultas: nunca negativo", hiddenEntryCount(1, 2, true), 0);
}

// Contador
{
  check("contador con 0", followedCountLabel(0), "Aún no sigues ninguna moneda");
  check("contador con 1", followedCountLabel(1), "Sigues 1 moneda, con precios en vivo");
  check("contador con 7", followedCountLabel(7), "Sigues 7 monedas, con precios en vivo");
}

// Estado de la pantalla
{
  const base: WatchlistStatusInput = {
    listError: false, listPending: false, entryCount: 3, pricesError: false,
    pricesPending: false, coinCount: 3, visibleCount: 3,
  };
  const todoMal: WatchlistStatusInput = {
    listError: true, listPending: true, entryCount: 0, pricesError: true,
    pricesPending: true, coinCount: 0, visibleCount: 0,
  };
  check("listo", resolveWatchlistStatus(base), "ready");
  check("error de lista gana a todo", resolveWatchlistStatus(todoMal), "list-error");
  check("cargando lista", resolveWatchlistStatus({ ...todoMal, listError: false }), "list-loading");
  check("vacío gana al error de precios",
    resolveWatchlistStatus({ ...todoMal, listError: false, listPending: false }), "empty");
  check("error de precios gana a cargando precios",
    resolveWatchlistStatus({ ...base, pricesError: true, pricesPending: true }), "prices-error");
  check("cargando precios", resolveWatchlistStatus({ ...base, pricesPending: true, coinCount: 0, visibleCount: 0 }), "prices-loading");
  check("ninguna en el top", resolveWatchlistStatus({ ...base, coinCount: 0, visibleCount: 0 }), "outside-top");
  check("búsqueda sin resultados", resolveWatchlistStatus({ ...base, visibleCount: 0 }), "no-matches");
  check("alguna fuera del top pero otras no: listo", resolveWatchlistStatus({ ...base, coinCount: 1, visibleCount: 1 }), "ready");
}

// Gráfica
{
  const serie = change24hSeries(lista);
  check("una barra por moneda, en el orden recibido", serie.map((bar) => bar.symbol), ["ETH", "BTC", "ADA"]);
  check("lleva el cambio 24 h", serie.map((bar) => bar.change24h), [3, -1.5, 0]);
  check("0 cuenta como subida, igual que la fila", serie.map((bar) => bar.isUp), [true, false, true]);
  check("forma de la barra", serie[1],
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", change24h: -1.5, isUp: false, isFavorite: true });
  check("sin monedas, serie vacía", change24hSeries([]), []);
}
