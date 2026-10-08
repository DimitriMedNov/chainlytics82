/**
 * Comprobaciones de la watchlist: cruce con el mercado, validación de lo
 * guardado, migración del formato antiguo y las operaciones sobre la lista.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { Coin } from "../../market/coin.ts";
import {
  addEntry,
  entryCoinId,
  hasSymbol,
  joinWithMarket,
  migrateLegacyWatchlist,
  nextFavorite,
  parseStoredWatchlist,
  removeEntry,
  setEntryFavorite,
  type WatchlistEntry,
} from "../entries.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const coin = (id: string, symbol: string, price: number): Coin => ({
  id, symbol, name: id, image: "", price, change24h: 0, rank: 1, change7d: null,
  marketCap: 0, volume24h: 0, high24h: 0, low24h: 0, ath: 0, athChangePct: 0, atl: 0,
  circulatingSupply: 0, totalSupply: null, fdv: null,
});

const coins = [coin("bitcoin", "BTC", 100_000), coin("ethereum", "ETH", 2_000)];
const btc: WatchlistEntry = { id: "bitcoin", symbol: "BTC", isFavorite: true };
const eth: WatchlistEntry = { id: "ethereum", symbol: "ETH", isFavorite: false };

// Cruce con el mercado
{
  const cruzadas = joinWithMarket([btc, eth], coins);
  check("cruza las dos", cruzadas.map((c) => c.id), ["bitcoin", "ethereum"]);
  check("trae el precio en vivo", cruzadas[0].price, 100_000);
  check("conserva el favorito", cruzadas.map((c) => c.isFavorite), [true, false]);
  check("respeta el orden guardado", joinWithMarket([eth, btc], coins).map((c) => c.symbol), ["ETH", "BTC"]);
  check("sin mercado cargado no hay nada", joinWithMarket([btc], undefined), []);
  check(
    "lo que no está en el top se descarta",
    joinWithMarket([btc, { id: "rara", symbol: "RARA", isFavorite: false }], coins).length,
    1,
  );
  check(
    "entrada migrada sin id cruza por símbolo",
    joinWithMarket([{ id: "", symbol: "ETH", isFavorite: false }], coins).map((c) => c.id),
    ["ethereum"],
  );
  check(
    "símbolo distinto cruza por id",
    joinWithMarket([{ id: "bitcoin", symbol: "XBT", isFavorite: false }], coins).map((c) => c.id),
    ["bitcoin"],
  );
}

// Lo guardado con el formato actual
{
  check("no es lista -> vacío", parseStoredWatchlist({ a: 1 }), []);
  check("null -> vacío", parseStoredWatchlist(null), []);
  check(
    "descarta lo que no es una entrada",
    parseStoredWatchlist([btc, null, "x", { symbol: "ETH" }, { symbol: 3, isFavorite: true }]),
    [btc],
  );
}

// Migración del formato antiguo ({id: number, symbol, price, change, coinId?})
{
  const viejo = [
    { id: 1, symbol: "btc", price: 50_000, change: 2, coinId: "bitcoin", isFavorite: true },
    { id: 2, symbol: "eth", price: 1_000, change: -1 },
    { id: 3, price: 1 },
    null,
  ];
  check("migra y normaliza", migrateLegacyWatchlist(viejo), [
    { id: "bitcoin", symbol: "BTC", isFavorite: true },
    { id: "", symbol: "ETH", isFavorite: false },
  ]);
  check("no es lista -> vacío", migrateLegacyWatchlist("roto"), []);
  check("sin id se sube con el símbolo en minúsculas", entryCoinId({ id: "", symbol: "ETH", isFavorite: false }), "eth");
  check("con id se sube con su id", entryCoinId(btc), "bitcoin");
}

// Operaciones sobre la lista
{
  const lista = [btc];
  const conEth = addEntry(lista, { id: "ethereum", symbol: "eth" });
  check("añade en mayúsculas y sin favorito", conEth[1], { id: "ethereum", symbol: "ETH", isFavorite: false });
  check("repetida devuelve la misma lista", addEntry(lista, { id: "otra", symbol: "btc" }) === lista, true);
  check("has no distingue mayúsculas", hasSymbol(lista, "btc"), true);
  check("has con una que no está", hasSymbol(lista, "ETH"), false);
  check("quita por símbolo", removeEntry(conEth, "btc").map((e) => e.symbol), ["ETH"]);
  check("alternar una favorita la desmarca", nextFavorite(conEth, "BTC"), false);
  check("alternar una no favorita la marca", nextFavorite(conEth, "eth"), true);
  check("alternar una que no está la marcaría", nextFavorite(conEth, "SOL"), true);
  check("marca solo la pedida", setEntryFavorite(conEth, "eth", true).map((e) => e.isFavorite), [true, true]);
  check("no toca la lista original", conEth.map((e) => e.isFavorite), [true, false]);
}
