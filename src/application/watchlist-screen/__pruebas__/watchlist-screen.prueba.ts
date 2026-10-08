/**
 * Comprobaciones de aplicación de la pantalla Watchlist: la vista completa
 * (cruce + búsqueda + orden + reparto) y los avisos exactos de las acciones.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { Coin } from "../../../domain/market/coin.ts";
import type { WatchlistEntry } from "../../../domain/watchlist/entries.ts";
import { DEFAULT_SORT } from "../../../domain/watchlist-screen/sort.ts";
import { convertIntent, removedNotice } from "../actions.ts";
import { buildWatchlistView } from "../buildView.ts";
import { favoritesTitle, othersTitle, rowLabels, sortArrow } from "../texts.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const coin = (id: string, symbol: string, name: string, price: number, change24h: number): Coin => ({
  id, symbol, name, image: "", price, change24h, rank: 1, change7d: null, marketCap: 0,
  volume24h: 0, high24h: 0, low24h: 0, ath: 0, athChangePct: 0, atl: 0, circulatingSupply: 0,
  totalSupply: null, fdv: null,
});

const market = [
  coin("bitcoin", "BTC", "Bitcoin", 100_000, -1.5),
  coin("ethereum", "ETH", "Ethereum", 2_000, 3),
  coin("cardano", "ADA", "Cardano", 0.5, 0),
];
const entries: WatchlistEntry[] = [
  { id: "ethereum", symbol: "ETH", isFavorite: false },
  { id: "bitcoin", symbol: "BTC", isFavorite: true },
  { id: "cardano", symbol: "ADA", isFavorite: true },
  { id: "rara", symbol: "RARA", isFavorite: false },
];

// Vista completa
{
  const view = buildWatchlistView(entries, market, "", DEFAULT_SORT);
  check("cruza con el top y descarta la de fuera", view.coins.map((c) => c.symbol), ["ETH", "BTC", "ADA"]);
  check("una oculta por estar fuera del top", view.hiddenCount, 1);
  check("ordena por nombre", view.sortedItems.map((c) => c.symbol), ["BTC", "ADA", "ETH"]);
  check("favoritas ordenadas", view.favorites.map((c) => c.symbol), ["BTC", "ADA"]);
  check("resto", view.others.map((c) => c.symbol), ["ETH"]);
  check("la gráfica sigue el orden visible", view.chartSeries.map((b) => b.symbol), ["BTC", "ADA", "ETH"]);

  const porPrecio = buildWatchlistView(entries, market, "", { field: "price", order: "desc" });
  check("el orden afecta también a favoritas", porPrecio.favorites.map((c) => c.symbol), ["BTC", "ADA"]);
  check("precio desc", porPrecio.sortedItems.map((c) => c.symbol), ["BTC", "ETH", "ADA"]);

  const buscada = buildWatchlistView(entries, market, "car", DEFAULT_SORT);
  check("la búsqueda filtra lo visible", buscada.sortedItems.map((c) => c.symbol), ["ADA"]);
  check("la búsqueda no toca `coins`", buscada.coins.length, 3);
  check("la gráfica sigue la búsqueda", buscada.chartSeries.map((b) => b.symbol), ["ADA"]);

  const sinMercado = buildWatchlistView(entries, undefined, "", DEFAULT_SORT);
  check("sin precios no hay monedas", sinMercado.coins, []);
  check("sin precios no se cuentan ocultas", sinMercado.hiddenCount, 0);

  const soloRara = buildWatchlistView([entries[3]], market, "", DEFAULT_SORT);
  check("ninguna en el top: sin monedas", soloRara.coins, []);
  check("ninguna en el top: una oculta", soloRara.hiddenCount, 1);
}

// Avisos y textos
{
  const { coins } = buildWatchlistView(entries, market, "", DEFAULT_SORT);
  check("aviso al quitar", removedNotice(coins, "BTC"),
    { title: "Eliminada del watchlist", description: "Bitcoin ya no está en tu lista" });
  check("aviso al quitar una sin precio: usa el símbolo", removedNotice(coins, "RARA"),
    { title: "Eliminada del watchlist", description: "RARA ya no está en tu lista" });
  check("convertir", convertIntent({ name: "Bitcoin" }), {
    to: "/converter",
    notice: { title: "Vamos al convertidor", description: "Ahí puedes convertir Bitcoin" },
  });
  check("título favoritas", favoritesTitle(2), "Favoritas (2)");
  check("título todas", othersTitle(1), "Todas (1)");
  check("flechas", [sortArrow("asc"), sortArrow("desc")], ["↑", "↓"]);
  check("etiqueta favorita marcada", rowLabels.favorite({ name: "Bitcoin", isFavorite: true }), "Quitar Bitcoin de favoritos");
  check("etiqueta favorita sin marcar", rowLabels.favorite({ name: "Bitcoin", isFavorite: false }), "Marcar Bitcoin como favorito");
  check("etiquetas de fila", [rowLabels.details({ name: "X" }), rowLabels.convert({ name: "X" }), rowLabels.remove({ name: "X" })],
    ["Ver detalles de X", "Convertir X", "Quitar X del watchlist"]);
}
